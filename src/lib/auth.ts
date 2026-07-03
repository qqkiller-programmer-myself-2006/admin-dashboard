import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { query } from "./db"

const SECRET = process.env.AUTH_SECRET || "fallback-secret"
const COOKIE_NAME = "session"

export interface UserPayload {
  id: number
  name: string
  email: string
  role: string
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function createToken(user: UserPayload) {
  return jwt.sign({ ...user }, SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as UserPayload
  } catch {
    return null
  }
}

export async function setSession(user: UserPayload) {
  const token = createToken(user)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function authenticateUser(email: string, password: string) {
  const result = await query("SELECT * FROM dashboard_users WHERE email = $1", [email])
  const user = result.rows[0]
  if (!user) return null
  const valid = await verifyPassword(password, user.password_hash)
  if (!valid) return null
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

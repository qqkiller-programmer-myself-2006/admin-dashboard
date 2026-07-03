const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "fallback-secret")

export interface UserPayload {
  id: number
  name: string
  email: string
  role: string
}

function base64UrlDecode(s: string) {
  s = s.replace(/-/g, "+").replace(/_/g, "/")
  while (s.length % 4) s += "="
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0))
}

function base64UrlEncode(buf: Uint8Array) {
  return btoa(String.fromCharCode(...buf)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

async function verifyJwt(token: string): Promise<UserPayload | null> {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const [, payloadB64, sigB64] = parts

    const key = await crypto.subtle.importKey(
      "raw", SECRET, { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
    )
    const valid = await crypto.subtle.verify(
      "HMAC", key, base64UrlDecode(sigB64),
      new TextEncoder().encode(parts[0] + "." + parts[1])
    )
    if (!valid) return null

    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64)))
    if (payload.exp && Date.now() >= payload.exp * 1000) return null
    return { id: payload.id, name: payload.name, email: payload.email, role: payload.role }
  } catch {
    return null
  }
}

export { verifyJwt }

import { handleAuth } from "./routes/auth.ts"

export function handleRequest(request: Request): Promise<Response> | Response {
  const url = new URL(request.url)

  if (request.method === "POST" && url.pathname === "/auth") {
    return handleAuth(request)
  }

  if (new URL(request.url).pathname === "/health") {
    return new Response(
      JSON.stringify({ ok: true, service: "backend" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    )
  }

  return new Response("Not found", { status: 404 })
}

import { handleRequest } from "./server.ts"

const port = Number(Deno.env.get("PORT") ?? 3000)

console.log(`Backend running on port ${port}`)

Deno.serve({ port }, handleRequest)

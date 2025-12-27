export function badRequest(message: string = "Bad request") {
  return new Response(
    JSON.stringify({ error: message }),
    { status: 400, headers: { "Content-Type": "application/json" } }
  )
}

export function notFound(message: string = "Not found") {
  return new Response(
    JSON.stringify({ error: message }),
    { status: 404, headers: { "Content-Type": "application/json" } }
  )
}

export function successJson<T>(data: T) {
  return new Response(
    JSON.stringify(data),
    { status: 200, headers: { "Content-Type": "application/json" } }
  )
}
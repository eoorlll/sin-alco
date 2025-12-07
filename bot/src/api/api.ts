const backendUrl = Deno.env.get("BACKEND_URL") ?? "http://backend:3000"

export async function apiPost<TResponse = unknown, TBody = unknown>(
  url: string,
  body: TBody,
): Promise<TResponse> {
  const res = await fetch(backendUrl + url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error ${res.status}: ${text}`)
  }

  return await res.json()
}
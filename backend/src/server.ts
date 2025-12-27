import { badRequest } from "./helpers/http.ts";
import { handleAuth } from "./routes/auth.ts"
import { handleCreateDrink, handleDeleteDrinkById, handleGetAllDrinks, handleGetDrinkById } from "./routes/drinks.ts";

export function handleRequest(request: Request): Promise<Response> | Response {
  const url = new URL(request.url)
  const drinkByIdPattern = new URLPattern({ pathname: "/drinks/:id" })
  const drinkMatch = drinkByIdPattern.exec(url)

  if (request.method === "POST" && url.pathname === "/auth") {
    return handleAuth(request)
  }

  if (request.method === "POST" && url.pathname === "/drinks") {
    return handleCreateDrink(request)
  }

  if (request.method === "GET" && url.pathname === "/drinks") {
    return handleGetAllDrinks()
  }

  if (request.method === "GET" && drinkMatch) {
    const id = drinkMatch.pathname.groups.id
    if (!id) return badRequest("Drink ID is required")

    return handleGetDrinkById(id)
  }

  if (request.method === "DELETE" && drinkMatch) {
    const id = drinkMatch.pathname.groups.id
    if (!id) return badRequest("Drink ID is required")

    return handleDeleteDrinkById(id)
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

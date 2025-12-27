import { badRequest } from "../helpers/http.ts";
import { usersCollection, User } from "../models/user.ts"

export async function handleAuth(request: Request): Promise<Response> {
  const { telegramId, name } = await request.json()

  if (!telegramId) {
    return badRequest("telegramId required")
  }

  const existingUser = await usersCollection.findOne({ telegramId })

  if (existingUser) {
    return new Response(
      JSON.stringify({
        status: "existing",
        id: existingUser._id,
        name: existingUser.name,
      }),
      { status: 200 }
    )
  }

  const newUser: User = {
    name,
    telegramId
  }

  const insertedId = await usersCollection.insertOne(newUser)

  return new Response(
    JSON.stringify({
      status: "registered",
      id: insertedId,
      name: newUser.name
    }),
    { status: 201 }
  )
}

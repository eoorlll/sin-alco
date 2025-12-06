import { badRequest } from "../helpers/http.ts";
import { usersCollection, User } from "../models/user.ts"

export async function handleAuth(request: Request): Promise<Response> {
  const { telegramId } = await request.json()

  if (!telegramId) {
    return badRequest("telegramId required")
  }

  const existingUser = await usersCollection.findOne({ telegramId })

  if (existingUser) {
    return new Response(
      JSON.stringify({
        status: "existing",
        userId: existingUser.userId
      }),
      { status: 200 }
    )
  }

  const newUser: User = {
    userId: Date.now(),
    telegramId
  }

  await usersCollection.insertOne(newUser)

  return new Response(
    JSON.stringify({
      status: "registered",
      userId: newUser.userId
    }),
    { status: 201 }
  )
}

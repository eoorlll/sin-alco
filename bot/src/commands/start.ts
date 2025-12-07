import { Context } from "grammy"
import { apiPost } from "../api/api.ts";

type AuthResponse = {
  status: "registered" | "existing"
  userId?: number
  name?: string
}

type AuthRequest = {
    telegramId: number
    name: string
}

const handleStartCommand = async (ctx: Context) => {
  const telegramId = ctx.from?.id

  if (!telegramId) {
    await ctx.reply("Не удалось получить telegram id.")
    return
  }

  const name = ctx.from.first_name ?? "Unknown user"

  try {
    const data = await apiPost<AuthResponse, AuthRequest>("/auth", {
      telegramId,
      name,
    })

    if (data.status === "registered") {
      await ctx.reply("Привет, я зарегистрировал тебя в системе.")
      return
    }

    if (data.status === "existing") {
      await ctx.reply(`Снова привет, ${data.name}`)
      return
    }

    await ctx.reply("Странный ответ от сервера.")
  } catch (e) {
    console.error("Auth request failed:", e)
    await ctx.reply("Не удалось связаться с сервером, попробуй позже.")
  }
}

export default handleStartCommand

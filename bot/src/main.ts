import { Bot } from "grammy"

const token = Deno.env.get("TELEGRAM_TOKEN")
if (!token) {
  throw new Error("TELEGRAM_TOKEN is not set")
}

const backendUrl = Deno.env.get("BACKEND_URL") ?? "http://backend:3000"

const bot = new Bot(token)

// /start
bot.command("start", async (ctx) => {
  const telegramId = ctx.from?.id

  if (!telegramId) {
    await ctx.reply("Не удалось получить telegram id.")
    return
  }

  const name = ctx.from?.first_name ?? "Unknown user"

  try {
    const res = await fetch(`${backendUrl}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, name }),
    })

    if (!res.ok) {
      console.error("Auth error:", res.status, await res.text())
      await ctx.reply("Сервер недоступен.")
      return
    }

    const data = await res.json() as { status?: string; userId?: number; name?: string }

    if (data.status === "registered") {
      await ctx.reply("Привет, я зарегистрировал тебя в системе.")
    } else if (data.status === "existing") {
      await ctx.reply(`Снова привет, ${data.name}`)
    } else {
      await ctx.reply("Странный ответ от сервера.")
    }
  } catch (e) {
    console.error("Auth request failed:", e)
    await ctx.reply("Не удалось связаться с сервером, попробуй позже.")
  }
})

// JIC
bot.catch((err) => {
  console.error("Bot error:", err.error)
})

bot.start()
console.log("Bot started with long polling")

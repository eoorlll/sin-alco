import { Bot } from "grammy"
import handleStartCommand from "./commands/start.ts";

const token = Deno.env.get("TELEGRAM_TOKEN")
if (!token) {
  throw new Error("TELEGRAM_TOKEN is not set")
}

const bot = new Bot(token)

// Set bot commands
await bot.api.setMyCommands([
  { command: "start", description: "Start the bot" },
]);

// Handle commands
bot.command("start", handleStartCommand)

// Handle errors
bot.catch((err) => {
  console.error("Bot error:", err)
})

//Start the bot
bot.start()

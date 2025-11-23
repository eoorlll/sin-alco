import { MongoClient } from "mongo"

const client = new MongoClient()
const uri = Deno.env.get("MONGO_URI") ?? "mongodb://mongo:27017/mydb"

async function connectWithRetry() {
  const maxAttempts = 10

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Mongo: trying to connect (${attempt}/${maxAttempts})`)
      await client.connect(uri)
      console.log("Mongo: connected")
      return
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      console.error("Mongo: connection failed:", msg)

      if (attempt === maxAttempts) throw e
      await new Promise((r) => setTimeout(r, 1000))
    }
  }
}

await connectWithRetry()

export const db = client.database("mydb")

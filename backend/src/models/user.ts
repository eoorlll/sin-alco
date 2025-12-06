import { db } from "../db.ts"

export interface User {
  _id?: { $oid: string }
  userId: number
  name: string
  telegramId: number
}

export const usersCollection = db.collection<User>("users")

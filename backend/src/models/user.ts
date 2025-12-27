import { ObjectId } from "mongo";
import { db } from "../db.ts"

export interface User {
  _id?: ObjectId
  name: string
  telegramId: number
}

export const usersCollection = db.collection<User>("users")

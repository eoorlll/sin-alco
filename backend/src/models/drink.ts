import { db } from "../db.ts"

export interface Drink {
  _id?: { $oid: string }
  drinkId: number
  userId: number
  createdAt: Date
  drinkDate: Date
  numberOfDrinks: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
}

export const drinksCollection = db.collection<Drink>("drinks")

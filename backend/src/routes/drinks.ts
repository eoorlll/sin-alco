import { ObjectId } from "mongo";
import { badRequest, notFound, successJson } from "../helpers/http.ts";
import { drinksCollection, Drink } from "../models/drink.ts"
import { usersCollection } from "../models/user.ts"

type CreateDrinkBody = {
    telegramId?: number
    drinkDate?: number
    numberOfDrinks?: number
}

function isValidPortion(n: number): n is Drink["numberOfDrinks"] {
    return n >= 1 && n <= 10 && Number.isInteger(n)
}

export async function handleCreateDrink(request: Request): Promise<Response> {
    let body: CreateDrinkBody

    try {
        body = await request.json()
    } catch {
        return badRequest("Invalid JSON")
    }

    const { telegramId, drinkDate, numberOfDrinks } = body

    if (
        typeof telegramId !== "number" ||
        typeof drinkDate !== "number" ||
        typeof numberOfDrinks !== "number"
    ) {
        return badRequest("telegramId, drinkDate, numberOfDrinks are required")
    }

    if (!isValidPortion(numberOfDrinks)) {
        return badRequest("numberOfDrinks must be integer 1..10")
    }

    const drinkDateObj = new Date(drinkDate)

    const user = await usersCollection.findOne({ telegramId })

    if (!user || !user._id) {
        return notFound("User not found")
    }

    const now = new Date()

    const drink: Drink = {
        userId: user._id,
        createdAt: now,
        drinkDate: drinkDateObj,
        numberOfDrinks
    }

    const insertedId = await drinksCollection.insertOne(drink)

    return new Response(
        JSON.stringify({
            ok: true,
            id: insertedId
        }),
        { status: 201, headers: { "Content-Type": "application/json" } }
    )
}

export async function handleGetAllDrinks(): Promise<Response> {
    const allUsers = await drinksCollection.find({}).toArray();

    return new Response(
        JSON.stringify(allUsers),
        { status: 200, headers: { "Content-Type": "application/json" } }
    )
}

export async function handleGetDrinkById(id: string): Promise<Response> {
    const drink = await drinksCollection.findOne({ _id: new ObjectId(id) })
    
    if (!drink) {
        return notFound("Drink not found")
    }

    return successJson(drink)
}

export async function handleDeleteDrinkById(id: string): Promise<Response> {
    if (!ObjectId.isValid(id)) {
        return badRequest("Invalid drink ID")
    }

    const deletedCount = await drinksCollection.deleteOne({ _id: new ObjectId(id) })
    
    if (deletedCount === 0) {
        return notFound("Drink not found")
    }

    return successJson({message: "Drink deleted successfully"})
}
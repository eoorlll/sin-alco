import { badRequest, notFound } from "../helpers/http.ts";
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

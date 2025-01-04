import { expiredTokensCollection } from "../db/mongodb"
import { JWTTokensModel } from "../input-output-types/expired-tokens-models"


export const expiredTokensRepository = {

    createExpiredToken: async function (token: JWTTokensModel) {
        const insertResult = await expiredTokensCollection.insertOne(token)
        return insertResult.insertedId.toString()
    },

    findExpiredToken: async function (token: string) {
        const filter = { token: token }
        const foundToken = await expiredTokensCollection.findOne(filter)
        return foundToken
    },

}
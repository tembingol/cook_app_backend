import { Collection, MongoClient } from "mongodb";
import { SETTINGS } from "../settings";
import { UserCredentialsModel, UserDataBaseModel } from "../input-output-types/users-moduls";
import { JWTTokensModel } from "../input-output-types/expired-tokens-models";

// получение доступа к бд
const client: MongoClient = new MongoClient(SETTINGS.MONGO_URL!)
export const db = client.db(SETTINGS.DB_NAME);

// почение доступа к коллекциям

export const usersCollection: Collection<UserDataBaseModel> = db.collection<UserDataBaseModel>(SETTINGS.USERS_COLLECTION_NAME)
export const usersCredentialsCollection: Collection<UserCredentialsModel> = db.collection<UserCredentialsModel>(SETTINGS.USERSCREDENTIALS_COLLECTION_NAME)
export const expiredTokensCollection: Collection<JWTTokensModel> = db.collection<JWTTokensModel>(SETTINGS.JWT_TOKENS_COLLECTION_NAME)

// проверка подключения к бд
export const connectMongoDB = async () => {
    try {
        await client.connect()
        await client.db().command({ ping: 1 })
        console.log('connected to mongo')
        return true
    } catch (e) {
        console.log('can not connected to mongo')
        console.log(e)
        await client.close()
        return false
    }
}
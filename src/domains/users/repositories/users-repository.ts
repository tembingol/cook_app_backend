import { ObjectId } from "mongodb"
import { usersCollection, usersCredentialsCollection } from "../../../db/mongodb"
import { UserCredentialsModel, UserDataBaseModel, UserViewModel } from "../../../input-output-types/users-moduls"

export const usersRepository = {

    createUser: async function (user: UserDataBaseModel, usersCredentials: UserCredentialsModel) {
        const newObjectId = new ObjectId()

        const newUser: UserDataBaseModel = {
            ...user,
            _id: newObjectId,
        }

        //toDo transaction {
        const insetrCredentials = usersCredentialsCollection.insertOne({
            ...usersCredentials,
            userId: newObjectId.toString()
        })

        const insertResult = await usersCollection.insertOne(newUser)
        //toDo transaction }

        return insertResult.insertedId.toString()
    },

    updateUser: async function (useriD: string, userInfo: UserViewModel) {
        const filter = { _id: new ObjectId(useriD) }
        const result = await usersCollection.updateOne(filter, { $set: userInfo })
        return result.modifiedCount === 1
    },

    deleteUser: async function (useriD: string) {
        const result = await usersCollection.deleteOne({ id: useriD })
        return result.deletedCount === 1
    },

    updateConfirmation: async function (useriD: string) {
        const filter = { _id: new ObjectId(useriD) }
        const result = await usersCollection.updateOne(filter, { $set: { 'emailConfirmation.isConfirmed': true } })
        return result.modifiedCount === 1
    },

    updateConfirmationCode: async function (useriD: string, confirmationCode: string) {
        const filter = { _id: new ObjectId(useriD) }
        const result = await usersCollection.updateOne(filter, { $set: { 'emailConfirmation.confirmationCode': confirmationCode } })
        return result.modifiedCount === 1
    },
}
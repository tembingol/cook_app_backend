import { ObjectId } from "mongodb"
import { usersCollection, usersCredentialsCollection } from "../../../db/mongodb"

export const usersQueryRepository = {

    getUserCredentials: async function (userId: string) {
        const filter = { userId: userId }
        const foundUser = await usersCredentialsCollection.findOne(filter)
        return foundUser
    },

    getUserByLogin: async function (login: string) {
        const filter = { login: login }
        const foundUser = await usersCollection.findOne(filter)
        return foundUser
    },

    getUserByEmail: async function (email: string) {
        const filter = { email: email }
        const foundUser = await usersCollection.findOne(filter)
        return foundUser
    },

    getUserById: async function (id: string) {
        const filter = { _id: new ObjectId(id) }
        const foundUser = await usersCollection.findOne(filter)
        return foundUser
    },

    getUserByConfirmationCode: async function (code: string) {
        const filter = { 'emailConfirmation.confirmationCode': code }
        const foundUser = await usersCollection.findOne(filter)
        return foundUser
    },

    getAllUsers: async function (pageNumber: Number, pageSize: Number, sortBy: string, sortDirection: string, filter: {},) {
        const _pageNumber = +pageNumber
        const _pageSize = +pageSize
        const _sortDirection = sortDirection === 'asc' ? 1 : -1

        const allUsers = await usersCollection.find(filter)
            .skip((_pageNumber - 1) * _pageSize)
            .limit(_pageSize)
            .sort({ [sortBy]: _sortDirection })
            .toArray()

        return allUsers
    },

    getDocumetnsCount: async function (filter: {}) {
        return await usersCollection.countDocuments(filter)
    }
}

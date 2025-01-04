import { ObjectId } from "mongodb"

export type UserCredentialsModel = {
    userId: string
    salt: string,
    hash: string
}

export type LoginInputModel = {
    loginOrEmail: string,
    password: string
}

export type UserInputModel = {
    login: string,//maxLength: 10 minLength: 3 pattern: ^[a-zA-Z0-9_-]*$ must be unique
    password: string, //maxLength: 20 minLength: 6
    email: string,//pattern: string, //^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$ example: string, // example@example.com must be unique
}

export type UserViewModel = {
    id: string
    login: string
    email: string
    createdAt: Date
}

export type UserDataBaseModel = {
    _id?: ObjectId
    login: string
    email: string
    createdAt: Date
    emailConfirmation: {
        confirmationCode: string
        expirationDate: Date
        isConfirmed: boolean
    }
    phoneConfirmation: {
        confirmationCode: string
        expirationDate: Date
        isConfirmed: boolean
    }
}
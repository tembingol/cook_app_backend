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
    role: UserRole
}

export type UserViewModel = {
    id: string
    login: string
    email: string
    phone: string
    createdAt: Date
    name: string
    password: string
    role: UserRole
    address: {
        address_preview: string
        coordinates: string
    }
    info_client: {
        people_to_cook_for: number
        number_of_meals: number
        kitchen: {
            count_burners: number
            count_cutting_boards: number
            count_pots: number
            count_frying_pans: number
            oven: boolean
            blender: boolean
        }
    }
    info_chef: {
        name: string
    }
}

type UserRole = ("client" | "chef")[]

export type UserDataBaseModel = {
    _id?: ObjectId
    login: string
    email: string
    phone: string
    createdAt: Date
    name: string
    password: string
    role: UserRole
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
    address: {
        address_preview: string
        coordinates: string
    }
    info_client: {
        people_to_cook_for: number
        number_of_meals: number
        kitchen: {
            count_burners: number
            count_cutting_boards: number
            count_pots: number
            count_frying_pans: number
            oven: boolean
            blender: boolean
        }
    }
    info_chef: {
        name: string
    }
}

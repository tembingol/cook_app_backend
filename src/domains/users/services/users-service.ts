import { UserInputModel, UserCredentialsModel, UserViewModel, UserDataBaseModel } from "../../../input-output-types/users-moduls"
import { ServicesResponseNew, HTTP_STATUS_CODE } from "../../../input-output-types/types"
import { usersRepository } from "../repositories/users-repository"
import { usersQueryRepository } from "../repositories/users-query-repo"
import bcrypt from "bcrypt"
import { userEntityMapper, usersQueryService } from "./users-query-service"



export const usersService = {

    createUser: async function (user: UserInputModel, isConfirmed: boolean = false) {
        const response: ServicesResponseNew<UserViewModel | {}> = {
            result: false,
            status: HTTP_STATUS_CODE.BadRequest,
            data: {},
            errors: { errorsMessages: [] }
        }

        if (!user.login) {
            response.errors.errorsMessages.push({ message: "login should be string", field: "login" })
        } else if (user.login.trim().length < 3 || user.login.trim().length > 10) {
            response.errors.errorsMessages.push({ message: "login should be more then 3 or 10", field: "login" })
        } else if (/^[a-zA-Z0-9_-]*$/.test(user.login.trim()) == false) {
            response.errors.errorsMessages.push({ message: "login is not valid", field: "login" })
        }

        if (!user.password) {
            response.errors.errorsMessages.push({ message: "password should be string", field: "password" })
        } else if (user.password.trim().length < 6 || user.password.trim().length > 20) {
            response.errors.errorsMessages.push({ message: "password should be more then 6 or 20", field: "password" })
        }

        if (!user.email) {
            response.errors.errorsMessages.push({ message: "email should be string", field: "email" })
        } else if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email.trim()) == false) {
            response.errors.errorsMessages.push({ message: "not an email", field: "email" })
        }

        if (!user.role) {
            response.errors.errorsMessages.push({ message: "role should be string", field: "role" })
        }

        if (user.role[0] !== "client" && user.role[0] !== "chef") {
            response.errors.errorsMessages.push({ message: "role should be client or chef", field: "role" })
        }

        if (response.errors.errorsMessages.length > 0) {
            return response
        }

        const isEmailAvalible = await usersQueryService.getUserByEmail(user.email)

        if (isEmailAvalible !== null) {
            response.errors.errorsMessages.push({ message: "email should be unique", field: "email" })
            return response
        }

        const isLoginAvalible = await usersQueryRepository.getUserByLogin(user.login)

        if (isLoginAvalible !== null) {
            response.errors.errorsMessages.push({ message: "login should be unique", field: "login" })
            return response
        }

        if (response.errors.errorsMessages.length > 0) {
            return response
        }

        const newUser: UserDataBaseModel = {
            login: user.login,
            createdAt: new Date(),
            email: user.email,
            emailConfirmation: {
                confirmationCode: 'string',
                expirationDate: new Date(),
                isConfirmed: isConfirmed
            },
            phoneConfirmation: {
                confirmationCode: 'string',
                expirationDate: new Date(),
                isConfirmed: false
            },
            phone: "",
            name: "",
            password: "",
            role: user.role,
            address: {
                address_preview: "",
                coordinates: ""
            },
            info_client: {
                people_to_cook_for: 0,
                number_of_meals: 0,
                kitchen: {
                    count_burners: 0,
                    count_cutting_boards: 0,
                    count_pots: 0,
                    count_frying_pans: 0,
                    oven: false,
                    blender: false
                }
            },
            info_chef: {
                name: ""
            }
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(user.password, salt)

        const usersCredentials: UserCredentialsModel = {
            userId: "",
            salt: salt,
            hash: hash
        }

        const newUserId = await usersRepository.createUser(newUser, usersCredentials)

        const createdUser = await usersQueryRepository.getUserById(newUserId)

        if (createdUser !== null) {
            response.result = true
            response.status = 201
            response.data = userEntityMapper(createdUser)
        }

        return response
    },

    deleteUser: async function (useriD: string) {
        const response: ServicesResponseNew<UserViewModel | {}> = {
            result: false,
            status: HTTP_STATUS_CODE.NotFound,
            data: {},
            errors: { errorsMessages: [] }
        }

        const isDeleted = await usersRepository.deleteUser(useriD)

        if (isDeleted) {
            response.result = true
            response.status = HTTP_STATUS_CODE.NoContent
        }

        return response
    },

    getUserByConfirmationCode: async function (confirmCode: string) {
        const response: ServicesResponseNew<UserViewModel | {}> = {
            result: false,
            status: HTTP_STATUS_CODE.BadRequest,
            data: {},
            errors: { errorsMessages: [] }
        }
        const foundUser = await usersQueryRepository.getUserByConfirmationCode(confirmCode)

        if (foundUser === null) {
            response.errors.errorsMessages.push({ message: "confirmation code is wrong", field: "code" })
            return response
        }

        if (foundUser.emailConfirmation.expirationDate < new Date()) {
            response.errors.errorsMessages.push({ message: "confirmation code is exparied", field: "code" })
            return response
        }

        if (foundUser.emailConfirmation.isConfirmed) {
            response.errors.errorsMessages.push({ message: "user already is confirmed", field: "code" })
            return response
        }

        response.result = true
        response.status = HTTP_STATUS_CODE.NoContent
        response.data = userEntityMapper(foundUser)

        return response
    },

    updateUser: async function (userId: string, userInfo: UserViewModel) {
        const response: ServicesResponseNew<UserViewModel | {}> = {
            result: false,
            status: HTTP_STATUS_CODE.NotFound,
            data: {},
            errors: { errorsMessages: [] }
        }

        const foundUser = await usersQueryRepository.getUserById(userId)

        if (foundUser === null) {
            return response
        }

        let isUserUpdated = false
        try {
            const userInfoToUpdate: UserViewModel = { ...userInfo }
            isUserUpdated = await usersRepository.updateUser(userId, userInfoToUpdate)
        } catch (error) {
            console.log(error)
            isUserUpdated = false
        }

        if (!isUserUpdated) {
            response.status = HTTP_STATUS_CODE.BadRequest
            return response
        }

        const updatedUser = await usersQueryRepository.getUserById(userId)

        if (updatedUser === null) {
            return response
        }

        response.result = true
        response.data = userEntityMapper(updatedUser)

        return response
    },
}
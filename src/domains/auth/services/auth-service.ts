import { jwtService } from "../../../application-services/JWT-service"
import { ServicesResponse } from "../../../input-output-types/services-models"
import { LoginInputModel, UserCredentialsModel, UserDataBaseModel, UserInputModel, UserViewModel } from "../../../input-output-types/users-moduls"
import { emailManager } from "../../../managers/emailManager"
import { usersQueryService } from "../../users/services/users-query-service"
import bcrypt from "bcrypt"
import { add, format, compareAsc } from "date-fns";
import { v4 as uuidv4 } from 'uuid';
import { usersRepository } from "../../users/repositories/users-repository"
import { usersService } from "../../users/services/users-service"
import { HTTP_STATUS_CODE } from "../../../input-output-types/types"

import { usersQueryRepository } from "../../users/repositories/users-query-repo"
import { randomInt } from "crypto"
import { smsManager } from "../../../managers/smsManager"


export const authService = {

    async checkUserCredintails(loginData: LoginInputModel) {
        let foundUser = await usersQueryService.getUserByLogin(loginData.loginOrEmail.trim())

        if (foundUser == null) {
            foundUser = await usersQueryService.getUserByEmail(loginData.loginOrEmail.trim())
        }

        if (foundUser === null) {
            return foundUser
        }

        const userCredentials = await usersQueryRepository.getUserCredentials(foundUser.id)

        if (userCredentials === null) {
            return userCredentials
        }

        const userHash = bcrypt.hashSync(loginData.password, userCredentials.salt)

        if (userHash !== userCredentials!.hash) {
            return null
        }

        return foundUser
    },

    async checkOTP(loginData: LoginInputModel) {
        const response: ServicesResponse = {
            result: false,
            status: HTTP_STATUS_CODE.Unauthorized,
            data: {},
            errors: { errorsMessages: [] }
        }

        let foundUser = await usersQueryService.getUserByLogin(loginData.loginOrEmail.trim())

        if (foundUser == null) {
            foundUser = await usersQueryService.getUserByEmail(loginData.loginOrEmail.trim())
        }

        if (foundUser === null) {
            return response
        }
        const DBuser = await usersQueryRepository.getUserById(foundUser.id)

        if (DBuser?.emailConfirmation.confirmationCode === loginData.password) {
            await usersRepository.updateConfirmationCode(DBuser._id.toString(), "")
            response.result = true
            response.status = HTTP_STATUS_CODE.OK
            response.data = foundUser
            return response
        }

        return response
    },

    async getSMS(reqBody: any) {
        const response: ServicesResponse = {
            result: false,
            status: HTTP_STATUS_CODE.BadRequest,
            data: {},
            errors: { errorsMessages: [] }
        }

        const confirmationCode = randomInt(1000, 9999).toString()
        try {
            const result = await smsManager.sendSMS(reqBody.login, `vash kod dostupa ${confirmationCode}`)
        } catch (error) {
            console.log(error)
            response.errors.errorsMessages.push({ message: "sms sending error", field: "login" })
        }

        response.result = true
        response.status = HTTP_STATUS_CODE.NoContent
        return response
        // if (!reqBody.login) {
        //     response.errors.errorsMessages.push({ message: "login should be string", field: "login" })
        //     return response
        // }

        // const isLoginEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(reqBody.login.trim())

        // let DBUser = null

        // if (isLoginEmail) {
        //  DBUser = await await usersQueryRepository.getUserByEmail(reqBody.login)
        // } else {
        //  DBUser = await await usersQueryRepository.getUserByLogin(reqBody.login)
        // }

        // if (!DBUser) {
        //     response.status = HTTP_STATUS_CODE.NotFound
        //     response.errors.errorsMessages.push({ message: "user not found", field: "login" })
        //     return response
        // }

        // const userLogin = isLoginEmail=== true ? reqBody.login : DBUser.email
        // const confirmationCode = randomInt(1000, 9999).toString()

        // const isEmailSended = await emailManager.sendOTPCode([userLogin], confirmationCode)

        // const confirmResult = await usersRepository.updateConfirmationCode(DBUser._id.toString(), confirmationCode)

        // if (!confirmResult) {
        //     return response
        // }

        response.result = true
        response.status = HTTP_STATUS_CODE.NoContent

        return response
    },

    async getOTP(reqBody: any) {
        const response: ServicesResponse = {
            result: false,
            status: HTTP_STATUS_CODE.BadRequest,
            data: {},
            errors: { errorsMessages: [] }
        }

        if (!reqBody.login) {
            response.errors.errorsMessages.push({ message: "login should be string", field: "login" })
            return response
        }

        const isLoginEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(reqBody.login.trim())

        let DBUser = null

        if (isLoginEmail) {
            DBUser = await await usersQueryRepository.getUserByEmail(reqBody.login)
        } else {
            DBUser = await await usersQueryRepository.getUserByLogin(reqBody.login)
        }

        if (!DBUser) {
            response.status = HTTP_STATUS_CODE.NotFound
            response.errors.errorsMessages.push({ message: "user not found", field: "login" })
            return response
        }

        const userLogin = isLoginEmail === true ? reqBody.login : DBUser.email
        const confirmationCode = randomInt(1000, 9999).toString()

        const isEmailSended = await emailManager.sendOTPCode([userLogin], confirmationCode)

        const confirmResult = await usersRepository.updateConfirmationCode(DBUser._id.toString(), confirmationCode)

        if (!confirmResult) {
            return response
        }

        response.result = true
        response.status = HTTP_STATUS_CODE.NoContent

        return response
    },

    async getUserByToken(userToken: string) {

        let foundUserFromToken = await jwtService.getUserIdFromToken(userToken)

        if (foundUserFromToken === null) {
            return null
        }

        const foundUser = await usersQueryService.getUserByLogin(foundUserFromToken.userLogin)

        if (foundUser === null) {
            return null
        }

        return userMapper(foundUser)
    },

    async confirmEmail(reqBody: any) {
        const response: ServicesResponse = {
            result: false,
            status: HTTP_STATUS_CODE.BadRequest,
            data: {},
            errors: { errorsMessages: [] }
        }

        if (!reqBody.code) {
            response.errors.errorsMessages.push({ message: "code should be string", field: "code" })
            return response
        }

        const DBUser = await usersService.getUserByConfirmationCode(reqBody.code)

        if (!DBUser.result) {
            return DBUser
        }

        const userData = DBUser.data as UserViewModel
        let userId = userData.id

        const confirmResult = await usersRepository.updateConfirmation(userId)

        if (confirmResult) {
            response.result = true
            response.status = HTTP_STATUS_CODE.NoContent
        }

        return response
    },

    async resendRegistrationEmail(reqBody: any) {
        const response: ServicesResponse = {
            result: false,
            status: 400,
            data: {},
            errors: { errorsMessages: [] }
        }

        if (!reqBody.email) {
            response.errors.errorsMessages.push({ message: "email should be string", field: "email" })
        } else if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(reqBody.email.trim()) == false) {
            response.errors.errorsMessages.push({ message: "not an email", field: "email" })
        }

        const foundUser = await usersQueryRepository.getUserByEmail(reqBody.email)

        if (foundUser === null) {
            response.result = false
            response.errors.errorsMessages.push({ message: "user with email not found", field: "email" })
            return response
        }

        if (foundUser.emailConfirmation.isConfirmed) {
            response.errors.errorsMessages.push({ message: "user already is confirmed", field: "email" })
            return response
        }

        if (foundUser.emailConfirmation.expirationDate < new Date()) {
            response.errors.errorsMessages.push({ message: "expirationDate", field: "email" })
            return response
        }

        const confirmationCode = randomInt(1000, 9999).toString()

        const confirmResult = await usersRepository.updateConfirmationCode(foundUser._id.toString(), confirmationCode)

        if (!confirmResult) {
            return response
        }

        const isEmailSended = await emailManager.sendRegistrationConfirmation([reqBody.email], confirmationCode)

        if (isEmailSended === false) {
            response.errors.errorsMessages.push({ message: "email sending error" })
        }

        response.result = true
        response.status = 204
        return response
    },

    async registerNewUser(user: UserInputModel) {

        const response: ServicesResponse = {
            result: false,
            status: HTTP_STATUS_CODE.BadRequest,
            data: {},
            errors: { errorsMessages: [] }
        }

        const isEmailAvalible = await usersQueryService.getUserByEmail(user.email)

        if (isEmailAvalible !== null) {
            response.result = false
            response.status = HTTP_STATUS_CODE.BadRequest
            response.data = {}
            response.errors.errorsMessages.push({ message: "email should be unique", field: "email" })
            return response
        }

        const isLoginAvalible = await usersQueryRepository.getUserByLogin(user.login)

        if (isLoginAvalible !== null) {
            response.result = false
            response.status = HTTP_STATUS_CODE.BadRequest
            response.data = {}
            response.errors.errorsMessages.push({ message: "login should be unique", field: "login" })
            return response
        }

        if (response.errors.errorsMessages.length > 0) {
            return response
        }

        const confirmationCode = randomInt(1000, 9999).toString()

        const newDBUser: UserDataBaseModel = {
            login: user.login,
            createdAt: new Date(),
            email: user.email,
            emailConfirmation: {
                confirmationCode: confirmationCode,
                expirationDate: add(new Date(), { hours: 1 }),
                isConfirmed: false
            },
            phoneConfirmation: {
                confirmationCode: confirmationCode,
                expirationDate: add(new Date(), { minutes: 1 }),
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

        const isCreated = await usersRepository.createUser(newDBUser, usersCredentials)
        if (isCreated === "") {
            return response
        }

        const isEmailSended = await emailManager.sendRegistrationConfirmation([user.email], confirmationCode)

        if (isEmailSended === false) {
            response.errors.errorsMessages.push({ message: "email sending error" })
        }

        response.result = true
        response.status = 204
        return response
    },

    async logoutUser(token: string) {
        const response: ServicesResponse = {
            result: false,
            status: HTTP_STATUS_CODE.Unauthorized,
            data: {},
            errors: { errorsMessages: [] }
        }

        const isExpired = await jwtService.isTokenExpired(token)

        if (isExpired) {
            return response
        }

        const isTokenBlocked = await jwtService.isTokenBlocked(token)

        if (isTokenBlocked) {
            return response
        }

        const foundUser = await authService.getUserByToken(token)

        if (foundUser === null) {
            return response
        }

        const result = await jwtService.createExpiredToken(token)

        response.result = true
        response.status = HTTP_STATUS_CODE.NoContent
        return response
    },

    async refreshToken(refreshToken: string) {
        const response: ServicesResponse = {
            result: false,
            status: HTTP_STATUS_CODE.Unauthorized,
            data: {},
            errors: { errorsMessages: [] }
        }

        const isExpired = await jwtService.isTokenExpired(refreshToken)

        if (isExpired) {
            return response
        }

        const isTokenBlocked = await jwtService.isTokenBlocked(refreshToken)

        if (isTokenBlocked) {
            return response
        }

        const foundUser = await authService.getUserByToken(refreshToken)

        if (foundUser === null) {
            return response
        }

        response.data = foundUser
        const result = await jwtService.createExpiredToken(refreshToken)

        response.result = true
        response.status = 204
        return response
    },

}

function userMapper(user: UserViewModel) {
    return {
        email: user.email,
        login: user.login,
        userId: user.id,
    }
}
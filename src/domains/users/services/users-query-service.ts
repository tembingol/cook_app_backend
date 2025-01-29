import { Result } from "express-validator"
import { ServicesResponseNew, PaginationResponseType, HTTP_STATUS_CODE } from "../../../input-output-types/types"
import { UserCredentialsModel, UserViewModel, UserDataBaseModel } from "../../../input-output-types/users-moduls"
import { usersQueryRepository } from "../repositories/users-query-repo"
import { jwtService } from "../../../application-services/JWT-service"

export const usersQueryService = {

    findUsers: async function (queryParams: any) {
        const pageNumber = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy = queryParams.sortBy ? queryParams.sortBy : "createdAt"
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'
        const searchLoginTerm = queryParams.searchLoginTerm ? queryParams.searchLoginTerm : ""
        const searchEmailTerm = queryParams.searchEmailTerm ? queryParams.searchEmailTerm : ""

        const filter: any = {
            $or: [
                { login: { $regex: searchLoginTerm, $options: 'i' } },
                { email: { $regex: searchEmailTerm, $options: 'i' } }]
        }

        const allUsers = await usersQueryRepository.getAllUsers(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            filter,
        )

        const mappedAllUsers = allUsers.map((el) => userEntityMapper(el))

        const totalCount = await usersQueryRepository.getDocumetnsCount(filter)

        const result: ServicesResponseNew<PaginationResponseType<UserViewModel>> = {
            result: true,
            status: 200,
            data: {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: mappedAllUsers,
            },
            errors: { errorsMessages: [] }
        }
        return result
    },

    getUserByEmail: async function (email: string) {
        const foundUser = await usersQueryRepository.getUserByEmail(email)
        if (foundUser) {
            return userEntityMapper(foundUser)
        }
        return foundUser
    },

    getUserByEmailServicesResponse: async function (email: string) {
        const response: ServicesResponseNew<UserViewModel | {}> = {
            result: false,
            status: HTTP_STATUS_CODE.BadRequest,
            data: {},
            errors: { errorsMessages: [] }
        }

        const foundUser = await usersQueryRepository.getUserByEmail(email)

        if (foundUser === null) {
            return response
        }

        response.result = true
        response.status = HTTP_STATUS_CODE.OK
        response.data = userEntityMapper(foundUser)

        return response
    },

    getUserByLogin: async function (login: string) {
        const foundUser = await usersQueryRepository.getUserByLogin(login)
        if (foundUser) {
            return userEntityMapper(foundUser)
        }
        return foundUser
    },

    getUserById: async function (id: string) {
        const response: ServicesResponseNew<UserViewModel | {}> = {
            result: false,
            status: HTTP_STATUS_CODE.BadRequest,
            data: {},
            errors: { errorsMessages: [] }
        }

        const foundUser = await usersQueryRepository.getUserById(id)
        if (foundUser === null) {
            return foundUser
        }
        return userEntityMapper(foundUser)

    },

    getUserCredentials: async function (userId: string) {
        const filter = { userId: userId }
        const foundUser = await usersQueryRepository.getUserCredentials(userId)
        if (foundUser) {
            return userCredentialsMapper(foundUser)
        }
        return foundUser
    },

    getUserInfoByLogin: async function (login: string) {
        const response: ServicesResponseNew<UserViewModel | {}> = {
            result: false,
            status: HTTP_STATUS_CODE.BadRequest,
            data: {},
            errors: { errorsMessages: [] }
        }

        console.log("login", login)
        let foundUser = await usersQueryRepository.getUserByLogin(login)
        if (!foundUser) {
            foundUser = await usersQueryRepository.getUserByEmail(login)
        }

        if (!foundUser) {
            response.status = HTTP_STATUS_CODE.NotFound
            return response
        }
        console.log("foundUser", foundUser)

        response.result = true
        response.status = HTTP_STATUS_CODE.OK
        response.data = userEntityMapper(foundUser)

        return response
    },

    getUserInfoByToken: async function (userToken: string) {
        const response: ServicesResponseNew<UserViewModel | {}> = {
            result: false,
            status: HTTP_STATUS_CODE.NotFound,
            data: {},
            errors: { errorsMessages: [] }
        }

        const playLoad = await await jwtService.tokenVerify(userToken)

        const foundUser = await usersQueryRepository.getUserById(playLoad!.userId)

        if (!foundUser) {
            return response
        }

        response.result = true
        response.status = HTTP_STATUS_CODE.OK
        response.data = userEntityMapper(foundUser)

        return response
    },
}

export function userEntityMapper(user: UserDataBaseModel): UserViewModel {
    return {
        id: user._id!.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
        name: user.name,
        password: user.password,
        role: user.role,
        phone: user.phone,
        address: {
            address_preview: user.address.address_preview,
            coordinates: user.address.coordinates,
        },
        info_client: {
            people_to_cook_for: user.info_client.people_to_cook_for,
            number_of_meals: user.info_client.number_of_meals,
            kitchen: {
                count_burners: user.info_client.kitchen.count_burners,
                count_cutting_boards: user.info_client.kitchen.count_cutting_boards,
                count_pots: user.info_client.kitchen.count_pots,
                count_frying_pans: user.info_client.kitchen.count_frying_pans,
                oven: user.info_client.kitchen.oven,
                blender: user.info_client.kitchen.blender,
            }
        },
        info_chef: {
            name: user.info_chef.name,
        }
    }
}

export function userCredentialsMapper(userCredential: UserCredentialsModel): UserCredentialsModel {
    return {
        userId: userCredential.userId,
        salt: userCredential.salt,
        hash: userCredential.hash,
    }
}
import { ServicesResponseNew, PaginationResponseType, HTTP_STATUS_CODE } from "../../../input-output-types/types"
import { UserCredentialsModel, UserViewModel, UserDataBaseModel } from "../../../input-output-types/users-moduls"
import { usersQueryRepository } from "../repositories/users-query-repo"

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
}

export function userEntityMapper(user: UserDataBaseModel): UserViewModel {
    return {
        id: user._id!.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    }
}

export function userCredentialsMapper(userCredential: UserCredentialsModel): UserCredentialsModel {
    return {
        userId: userCredential.userId,
        salt: userCredential.salt,
        hash: userCredential.hash,
    }
}
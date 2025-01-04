import { UserViewModel } from "./users-moduls"

export type PaginationResponseType<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T[]
}

export type ServicesResponseNew<T> = {
    result: boolean,
    status: HTTP_STATUS_CODE,
    data: T,
    errors: OutputErrors,
}

export type OutputErrors = {
    errorsMessages: {
        message: string,
        field: string
    }[]
}

export enum EmailConfirmationStatus {
    confirmed = 1,
    notConfirmed = 2,
}

export enum PhoneConfirmationStatus {
    confirmed = 1,
    notConfirmed = 2,
}

export enum HTTP_STATUS_CODE {
    OK = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
}

//example user
const responTest: ServicesResponseNew<UserViewModel> = {
    result: false,
    status: HTTP_STATUS_CODE.OK,
    data: {
        id: "",
        login: "",
        email: "",
        createdAt: new Date()
    },
    errors: {
        errorsMessages: []
    }
}

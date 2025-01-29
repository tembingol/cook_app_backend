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
        createdAt: new Date(),
        phone: "",
        name: "",
        password: "",
        role: [],
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
    },
    errors: {
        errorsMessages: []
    }
}

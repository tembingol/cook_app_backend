import { UserInputModel } from './users-moduls'

export type FieldNamesType = keyof UserInputModel
// const f: FieldsType = 'some' // error

export type OutputErrorsType = {
    errorsMessages: { message: string, field: FieldNamesType }[]
}

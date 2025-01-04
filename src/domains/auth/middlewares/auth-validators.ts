import { body, header } from 'express-validator'
import { inputCheckErrorsMiddleware } from '../../../global-middlewares/input-Check-Errors-Middleware'

export const loginOrEmailValidator = body('loginOrEmail')
    .isString().withMessage('not string')
export const passwordValidator = body('password')
    .isString().withMessage('not string')

export const registrationLoinValidator = body('login')
    .isString().withMessage('not string')
    .isLength({ min: 3, max: 10 }).withMessage('more then 10 or less than 3')
export const registrationPasswordValidator = body('password')
    .isString().withMessage('not string')
    .trim()
    .isLength({ min: 6, max: 20 }).withMessage('more then 20 or less than 6')
export const registrationEmailValidator = body('email')
    .isString().withMessage('not string')
    .isEmail().withMessage('not valid email')

export const authLoginValidators = [

    loginOrEmailValidator,
    passwordValidator,

    inputCheckErrorsMiddleware,
]

export const authRegistrationValidators = [

    registrationLoinValidator,
    registrationPasswordValidator,
    registrationEmailValidator,

    inputCheckErrorsMiddleware,
]


export const authHeaderValidator = header('Authorization'.toLowerCase())
    .isString().withMessage('not string')
import { body } from 'express-validator'
import { inputCheckErrorsMiddleware } from '../../../global-middlewares/input-Check-Errors-Middleware'
import { NextFunction, Request, Response } from 'express'

// login: string, maxLength: 10 minLength: 3 pattern: ^[a-zA-Z0-9_-]*$ must be unique
// password: string, //maxLength: 20 minLength: 6
// email: string, // pattern: string, //^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$ // example: string, // example@example.com must be unique


export const userLoginValidator = body('login')
    .isString().withMessage('not string')
export const userPasswordValidator = body('password')
    .isString().withMessage('not string')
    .trim().isLength({ min: 3, max: 10 }).withMessage('more then 10 or 3')
export const userEmailValidator = body('email')
    .isString().withMessage('not string')
    .trim().isEmail().withMessage('not email')

export const userRegistrationValidators = [
    //userLoginValidator,
    //userPasswordValidator,
    //userEmailValidator,
    inputCheckErrorsMiddleware,
]

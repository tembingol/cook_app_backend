import { Router } from "express"
import { authRegistrationValidators, authLoginValidators } from "../middlewares/auth-validators"
import { jwtService } from "../../../application-services/JWT-service"
import { HTTP_STATUS_CODE } from "../../../input-output-types/types"
import { UserViewModel } from "../../../input-output-types/users-moduls"
import { authService } from "../services/auth-service"

export const authRouter = Router({})

// simple logger for this router's requests
// all requests to this router will first hit this middleware
// authRouter.use(function (req, res, next) {
//     console.log('authRouter Logger \n{--')
//     console.log('%s ,%s ,%s', req.method, req.body, req.baseUrl + req.url)
//     console.log('--}')
//     next()
// })

authRouter.post('/get-otp', async (req, res) => {

    const serviceRes = await authService.getOTP(req.body)
    if (serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data)
        return
    }
    res.status(serviceRes.status).json(serviceRes.errors)
})

authRouter.post('/get-sms', async (req, res) => {

    const serviceRes = await authService.getSMS(req.body)
    if (serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data)
        return
    }
    res.status(serviceRes.status).json(serviceRes.errors)
})

authRouter.post('/registration', ...authRegistrationValidators, async (req, res) => {

    const serviceRes = await authService.registerNewUser(req.body)
    if (serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data)
        return
    }
    res.status(serviceRes.status).json(serviceRes.errors)
})

authRouter.post('/registration-confirmation', async (req, res) => {

    const serviceRes = await authService.confirmEmail(req.body)
    if (serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data)
        return
    }
    res.status(serviceRes.status).json(serviceRes.errors)
})

authRouter.post('/registration-email-resending', async (req, res) => {

    const serviceRes = await authService.resendRegistrationEmail(req.body)
    if (serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data)
        return
    }
    res.status(serviceRes.status).json(serviceRes.errors)
})

authRouter.post('/login/v2', ...authLoginValidators, async (req, res) => {

    const foundUser = await authService.checkUserCredintails(req.body)

    if (foundUser === null) {
        res.sendStatus(401)
        return
    }

    const accessToken = await jwtService.createAccsessJWT(foundUser)
    const refreshToken = await jwtService.createRefreshJWT(foundUser)

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, })
    res.status(200).send({ accessToken: accessToken })
})

authRouter.post('/login', async (req, res) => {

    const serviceRes = await authService.checkOTP(req.body)

    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status)
        return
    }

    const foundUser = serviceRes.data as UserViewModel
    const accessToken = await jwtService.createAccsessJWT(foundUser)
    const refreshToken = await jwtService.createRefreshJWT(foundUser)

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, })
    res.status(serviceRes.status).send({ accessToken: accessToken })
})

authRouter.post('/logout', async (req, res) => {

    const refreshToken = req.cookies.refreshToken

    if (refreshToken === undefined) {
        res.sendStatus(HTTP_STATUS_CODE.Unauthorized)
        return
    }

    const serviceRes = await authService.logoutUser(refreshToken as string)

    if (!serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data)
        return
    }

    res.sendStatus(HTTP_STATUS_CODE.NoContent)
})

authRouter.post('/refresh-token', async (req, res) => {

    const refreshToken = req.cookies.refreshToken
    if (refreshToken === undefined) {
        res.sendStatus(HTTP_STATUS_CODE.Unauthorized)
        return
    }

    const serviceRes = await authService.refreshToken(refreshToken)

    if (!serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data)
        return
    }

    const foundUser = serviceRes.data as UserViewModel
    const accessToken = await jwtService.createAccsessJWT(foundUser)
    const newRefreshToken = await jwtService.createRefreshJWT(foundUser)

    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, })
    res.status(HTTP_STATUS_CODE.OK).send({ accessToken: accessToken })

})

authRouter.get('/login/me', async (req, res) => {

    const authorization = req.headers['Authorization'.toLowerCase()]

    if (authorization == undefined) {
        res.sendStatus(HTTP_STATUS_CODE.Unauthorized)
        return
    }

    const accessToken = authorization.slice(7)

    const foundUser = await authService.getUserByToken(accessToken.toString())

    if (foundUser === null) {
        res.sendStatus(HTTP_STATUS_CODE.Unauthorized)
        return
    }

    console.log(foundUser)
    res.status(HTTP_STATUS_CODE.OK).send(foundUser)

})

authRouter.get('/me', async (req, res) => {

    const authorization = req.headers['Authorization'.toLowerCase()]
    if (authorization == undefined) {
        res.sendStatus(HTTP_STATUS_CODE.Unauthorized)
        return
    }

    const accessToken = authorization.slice(7)

    const foundUser = await authService.getUserByToken(accessToken.toString())

    if (foundUser === null) {
        res.sendStatus(HTTP_STATUS_CODE.Unauthorized)
        return
    }

    res.status(HTTP_STATUS_CODE.OK).send(foundUser)

})
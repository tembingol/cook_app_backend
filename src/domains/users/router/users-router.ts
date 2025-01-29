import { Router } from "express"
import { usersQueryService } from "../services/users-query-service"
import { baseAuthMiddleware } from "../../../global-middlewares/base-auth-middleware"
import { userRegistrationValidators } from "../middlewares/users-validators"
import { usersService } from "../services/users-service"
import { HTTP_STATUS_CODE } from "../../../input-output-types/types"
import { accessTokenValidator } from "../../auth/middlewares/access-token-validator"

export const usersRouter = Router({})

usersRouter.get('/', async (req, res) => {
    const serviceRes = await usersQueryService.findUsers(req.query)
    res.status(serviceRes.status).json(serviceRes.data)
})

usersRouter.post('/userinfo', async (req, res) => {
    const userLogin = req.body.loginOrEmail

    if (!userLogin) {
        res.status(HTTP_STATUS_CODE.BadRequest).json({ message: 'No user id provided' })
        return
    }

    const serviceRes = await usersQueryService.getUserInfoByLogin(userLogin)
    res.status(serviceRes.status).json(serviceRes.data)
})

usersRouter.get('/me', accessTokenValidator, async (req, res) => {
    const authorization = req.headers['Authorization'.toLowerCase()]

    const accessToken = authorization!.slice(7) as string

    const serviceRes = await usersQueryService.getUserInfoByToken(accessToken)
    res.status(serviceRes.status).json(serviceRes.data)
})

usersRouter.put('/:id', async (req, res) => {
    const userId = req.params.id
    const userInfo = req.body

    const serviceRes = await usersService.updateUser(userId, userInfo)
    res.status(serviceRes.status).json(serviceRes.data)

})

usersRouter.post('/', baseAuthMiddleware, ...userRegistrationValidators, async (req, res) => {
    const serviceRes = await usersService.createUser(req.body, true)

    if (serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data)
        return
    }

    res.status(serviceRes.status).json(serviceRes.errors)
})

usersRouter.delete('/:id', baseAuthMiddleware, async (req, res) => {
    const serviceRes = await usersService.deleteUser(req.params.id)
    if (serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data)
        return
    }

    res.sendStatus(serviceRes.status)
})
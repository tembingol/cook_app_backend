import { Router } from "express"
import { usersQueryService } from "../services/users-query-service"
import { baseAuthMiddleware } from "../../../global-middlewares/base-auth-middleware"
import { userRegistrationValidators } from "../middlewares/users-validators"
import { usersService } from "../services/users-service"

export const usersRouter = Router({})

// // simple logger for this router's requests
// // all requests to this router will first hit this middleware
// blogsRouter.use(function (req, res, next) {
//     console.log('usersRouter Logger \n{--')
//     console.log('%s ,%s ,%s', req.method, req.body, req.baseUrl + req.url)
//     console.log('--}')
//     next()
// })

usersRouter.get('/', async (req, res) => {
    const serviceRes = await usersQueryService.findUsers(req.query)
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
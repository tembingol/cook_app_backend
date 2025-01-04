import { Request, NextFunction, Response } from "express"
import { jwtService } from "../application-services/JWT-service"

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization

    if (!authorization) {
        res.status(401).json({})
        return
    }

    const userToken = authorization.split(' ')[1]

    let foundUser = await jwtService.getUserIdFromToken(userToken)

    if (foundUser === null) {
        res.sendStatus(401)
        return
    }

    req.context = { currentUser: foundUser }

    next()
}

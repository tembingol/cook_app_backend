import { Request, Response, NextFunction } from "express"
import { HTTP_STATUS_CODE } from "../../../input-output-types/types"
import { jwtService } from "../../../application-services/JWT-service"

// Middleware to validate accessToken
export const accessTokenValidator = async (req: Request, res: Response, next: NextFunction) => {

    const authorization = req.headers['Authorization'.toLowerCase()]

    if (authorization == undefined) {
        res.sendStatus(HTTP_STATUS_CODE.Unauthorized)
        return
    }

    const accessToken = authorization.slice(7) as string

    if (!accessToken || accessToken === '') {
        res.status(HTTP_STATUS_CODE.Unauthorized).json({
            errorsMessages: { message: 'refreshToken is missing', field: 'refreshToken' }
        })
        return
    }

    const playLoad = await jwtService.tokenVerify(accessToken)

    if (!playLoad || playLoad.userId === undefined) {
        res.status(HTTP_STATUS_CODE.Unauthorized).json({
            errorsMessages: { message: 'accessToken is not valid ', field: 'accessToken' }
        })
        return
    }

    next()
}
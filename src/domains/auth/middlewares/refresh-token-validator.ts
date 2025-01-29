import { Request, Response, NextFunction } from "express"
import { HTTP_STATUS_CODE } from "../../../input-output-types/types"
import { jwtService } from "../../../application-services/JWT-service"

// Middleware to validate refreshToken
export const refteshTokenValidator = async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken

    if (refreshToken === undefined) {
        res.status(HTTP_STATUS_CODE.Unauthorized).json({
            errorsMessages: { message: 'refreshToken is missing', field: 'refreshToken' }
        })
        return
    }

    const playLoad = await jwtService.tokenVerify(refreshToken)

    if (!playLoad || playLoad.userId === undefined) {
        res.status(HTTP_STATUS_CODE.Unauthorized).json({
            errorsMessages: { message: 'refreshToken is not valid ', field: 'refreshToken' }
        })
        return
    }

    next()
}
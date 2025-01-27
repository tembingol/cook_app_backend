import { UserViewModel } from "../input-output-types/users-moduls";
import Jwt from "jsonwebtoken";
import { SETTINGS } from "../settings";
import { JWTTokensModel } from "../input-output-types/expired-tokens-models";
import { expiredTokensRepository } from "./JWT-repository";
const jwt = Jwt;

export const jwtService = {

    //todo: add  expiresIn: '1d' from settings
    async createAccsessJWT(user: UserViewModel) {
        const accessToken_JWT = await jwt.sign({ userId: user.id, userLogin: user.login }, SETTINGS.JWT_SECRET, { expiresIn: '1d' })
        return accessToken_JWT
    },

    //todo: add  expiresIn: '1d' from settings
    async createRefreshJWT(user: UserViewModel) {
        const refreshToken_JWT = await jwt.sign({ userId: user.id, userLogin: user.login }, SETTINGS.JWT_SECRET, { expiresIn: '7d' })
        return refreshToken_JWT
    },

    async getUserIdFromToken(token: string) {
        try {
            const result = await jwt.verify(token, SETTINGS.JWT_SECRET)
            if (typeof result === "string") {
                return null
            }
            return { userId: result.userId, userLogin: result.userLogin }
        } catch (err) {
            //console.log(err)
            return null
        }
    },

    async isTokenExpired(token: string) {
        try {
            const result = await jwt.verify(token, SETTINGS.JWT_SECRET)
            return false
        } catch (err) {
            return true
        }
    },

    async isTokenBlocked(token: string) {
        const result = await expiredTokensRepository.findExpiredToken(token)
        if (result === null) {
            return false
        }
        return true
    },

    async createExpiredToken(token: string) {

        const expiredToken: JWTTokensModel = {
            token: token,
            expiredAt: new Date(),
            status: 1
        }

        const result = await expiredTokensRepository.createExpiredToken(expiredToken)
        return result
    },


}
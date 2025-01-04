import express from 'express'
import cookieParser from 'cookie-parser'
import { SETTINGS } from './settings'
import { usersRouter } from './domains/users/router/users-router'
import { authRouter } from './domains/auth/router/auth-router'
import { testingRouter } from './domains/testing/testing-router'
import cors from 'cors'

export const app = express() // создать приложение
app.use(cors())
app.use(express.json()) // создание свойств-объектов body и query во всех реквестах
app.use(cookieParser())

app.get(SETTINGS.PATH.ROOT, (req, res) => {
  // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
  res.status(200).json({ version: '0.1' })
})

app.use(SETTINGS.PATH.USERS, usersRouter)
app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)

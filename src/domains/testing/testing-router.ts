import { Router } from "express";
import {usersCollection, usersCredentialsCollection } from "../../db/mongodb";

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req, res) => {
    await usersCollection.drop()
    await usersCredentialsCollection.drop()
    res.sendStatus(204)
})

import { exit } from 'process'
import { app } from './app'
import { connectMongoDB } from './db/mongodb'
import { SETTINGS } from './settings'

const startApp = async () => {

    const mongoConneted = await connectMongoDB()
    if (mongoConneted) {
        app.listen(SETTINGS.PORT, () => {
            console.log('...server started in port ' + SETTINGS.PORT)
        })
    } else {
        console.log('App not started... ')
        exit()
    }
}

startApp()

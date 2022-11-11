import express from 'express'
const app = express()
import {router} from './routes/routes.js'

app.use(express.json())
app.use(router)

app.listen('8080',()=>{
    console.log("server started")
})
import {Router} from 'express'
import {midFunc} from '../middleware/middleware.js'
import {exchangeData}  from '../controller/exchangeData.js'

export let router =  Router()

router.get('/getData',midFunc,exchangeData)


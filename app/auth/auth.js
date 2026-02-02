import crypto from 'crypto'
import { requestLog } from '../model/historis_models.js'

export default async function auth(req,res,next) {
    try {
        req.requestID = await requestLog(req)
        next()
    } catch (error) {
        console.log(error)
    }
}
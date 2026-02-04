import crypto from 'crypto'
import { requestLog } from '../model/historis_models.js'
import errHandler from '../libraries/errHandler.js'
import { referenceCheck, tokenCheck, versionCheck } from '../model/auth.js'

export default async function auth(req,res,next) {
    req.requestID = await requestLog(req)
    try {
        
        if(!req.headers["version"] || !req.headers["x-signature"] || 
            !req.headers["dateRequest"] || !req.headers["token"] || 
            !req.headers["username"] || !req.headers["x-reference"]) {
            throw {
                statusCode : "02",
                message : "invalid auth"
            }
        }

        await referenceCheck(req.headers["x-reference"])
        await tokenCheck(req.headers["token"])
        await versionCheck(req.headers["version"])
        
        const payloadSignature = {
            refno : req.headers["x-reference"],
            dateRequest : req.headers["dateRequest"],
            version : req.headers["vision"],
            token : req.headers["token"]
        }

        const hmac = crypto.createHmac("sha256", process.env.hmacKey);
        hmac.update(JSON.stringify(payloadSignature));
        const expectedSignature = hmac.digest("hex");

        if (expectedSignature !== req.headers["x-signature"]) throw {
            statusCode : "02",
            message : "Invalid signature"
        }
       
        next()
    } catch (error) {
       await errHandler(res,error,req.requestID)
    }
}
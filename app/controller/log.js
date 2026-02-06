import { responLog } from "../model/historis_models.js"
import errHandler from "../libraries/errHandler.js"
import { logRequest } from "../model/log.js"

export const log = async (req,res)=>{
    try {
        
        if (!req.query.tanggalAwal || !req.query.tanggalAkhir) throw {
            status : 400,
            statusCode : '03',
            message : 'Invalid request format'
        }
        
        await responLog(res,200,await logRequest(req.query),req.requestID)


    } catch (error) {
        await errHandler(res,error,req.requestID)
    }
}
import errHandler from "../libraries/errHandler.js"
import { responLog } from "../model/historis_models.js"
import { debitur } from "../model/debitur.js"

export const dataDebitur = async(req,res)=>{
    try {
        
        if (!req.query.account) throw {
            statusCode : '03',
            status : 400,
            message : "Parameter tidak ditemukan"
        }
        
        await responLog(res,200,{
            statusCode : '00',
            message : 'Data ditemukan',
            data : await debitur(req.query.account)

        }, req.requestID)

    } catch (error) {
        await errHandler(res,error,req.requestID)
    }
}
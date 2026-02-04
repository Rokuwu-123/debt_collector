import errHandler from "../libraries/errHandler.js"
import { responLog } from "../model/historis_models.js"
import { encrypt, decrypt } from "../libraries/payloadEncrypt.js"
import { loginModels } from "../model/users.js"

export const login = async(req,res)=>{
    try {
        
        const data = req.body

        if (!data.username || !data.password) throw {
            status : 400,
            statusCode : "03",
            message : "Error payload format"
        }
        
        let dataLogin = await loginModels(data)
        const payload = {
            statusCode : "00",
            message : "Berhasil login",
            data : {
                nama : dataLogin.nama,
                token : dataLogin.token,
                validUntil : dataLogin.valid_until
            }
        }
        await responLog(res,200,payload,req.requestID)


    } catch (error) {
        await errHandler(res,error,req.requestID)
    }
}
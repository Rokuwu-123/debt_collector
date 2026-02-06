import errHandler from "../libraries/errHandler.js"
import { responLog } from "../model/historis_models.js"
import { debitur, transaksi, riwayatTransaksi } from "../model/debitur.js"

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

export const payment = async(req,res)=>{
    try {
        console.log(req.body)
        if(!req.body.account && !req.body.pokok && !req.body.bunga && !req.body.denda) throw {
            status : 400,
            statusCode : "03",
            message : "Invalid payload"
        }

        if (req.body.pokok + req.body.bunga + req.body.denda <= 0) throw {
            status : 400,
            statusCode : "03",
            message : "Invalid nominal transaksi"
        }

        await responLog(res,200,{
            statusCode : '00',
            message : 'Transaksi berhasil',
            data : await transaksi(req.body, req.headers['x-reference'])
        }, req.requestID)
        
    } catch (error) {
        await errHandler(res,error,req.requestID)
    }
}

export const histori = async(req,res)=>{
    try {
        
        if (!req.query.tanggalAwal && !req.query.tanggalAkhir) throw {
            status : 400,
            statusCode : '03',
            message : 'Invalid request format'
        }
        
        if (!req.headers['username']) throw {
            status : 401,
            statusCode : '02',
            message : 'Invalid username'
        }
        
        await responLog(res,200,{
            statusCode : '00',
            message : 'Data ditemukan',
            data : await riwayatTransaksi(req.query, req.headers['username'])
        }, req.requestID)
        

    } catch (error) {
        await errHandler(res,error,req.requestID)
    }
}
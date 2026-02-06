import { prismaDB } from "../controller/database.js";

export const logRequest = async(data)=>{
    let returnValue = []
    await prismaDB.$transaction(async (tx)=>{
        const log = await tx.$queryRaw`select ip_address, base_url url, method,
        body_request, to_char(date_request,'DD-MM-YYYY HH24:mm') tanggal, noref reference,
        body_respon from log where date_request::date between ${data.tanggalAwal}  and ${data.tanggalAkhir}`

        returnValue = log

    })

    return returnValue
}
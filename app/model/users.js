import { prismaDB } from "../controller/database.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { formatDate } from "../libraries/libraries.js";

export const loginModels = async(data)=>{
    let datauser
    await prismaDB.$transaction(async (tx)=>{
        const dataUsers = await tx.users.findMany({
            where : {
                username : data.username
            }
        })

        const matchPassword = await bcrypt.compare(dataUsers[0].password.trim(),data.password)

        if (!dataUsers || !matchPassword) throw {
            statusCode : "01",
            message : "User atau password salah"
        }

        const payload = {
            user_id : dataUsers[0].user_id,
            nama : dataUsers[0].nama
        }
        const token = jwt.sign(payload, process.env.jwtKey)
        
        // const tokenSession = await tx.$queryRaw`insert into token(token, user_id, login_date) values('${token}',${dataUsers[0].users_id},now()) returning to_char(valid_until,'DD-MM-YYYY HH24:mm') valid_until`
        const tokenSession = await tx.token.create({
            data : {
                token : token,
                user_id : payload.user_id,
                login_date : new Date()
            },
            select : {
                valid_until : true
            }
        })
        datauser = dataUsers[0]
        datauser.valid_until = formatDate(tokenSession.valid_until)
        datauser.token = token
    })

    return datauser
}
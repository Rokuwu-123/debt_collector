import { prismaDB } from "../controller/database.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const loginModels = async({username, password})=>{
    let datauser
    await prismaDB.$transaction(async (tx)=>{
        const dataUsers = tx.users.findUnique({
            where : {
                username : username
            }
        })

        const matchPassword = await bcrypt.compare(password, dataUsers.password)

        if (!dataUsers || !matchPassword) throw {
            statusCode : "01",
            message : "User atau password salah"
        }

        const payload = {
            user_id : dataUsers.user_id,
            nama : dataUsers.nama
        }
        const token = jwt.sign(payload, process.env.jwtKey)
        
        const tokenSession = tx.$queryRaw`insert into token(token, user_id, login_date) values('${token}',${dataUsers.users_id},now()) returning to_char(valid_until,'DD-MM-YYYY HH24:mm') valid_until`

        datauser = dataUsers
        datauser.valid_until = tokenSession[0].valid_until
        datauser.token = token
    })

    return datauser
}
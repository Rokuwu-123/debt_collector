import { prismaDB } from "../controller/database.js";

export const referenceCheck = async(reference)=>{

    let returnValue = true
    await prismaDB.$transaction(async (tx)=>{
        const dataReference = await tx.log.findUnique({
            where : {
                noref : reference
            } 
        })

        if (dataReference) returnValue = false
    })

    return returnValue

}

export const versionCheck = async(version)=>{

    let returnValue = true

    await prismaDB.$transaction(async(tx)=>{
        const currentVersion = await tx.version.findMany({
            select : {
                version : true
            },
            orderBy : {
                update_date : desc
            },
            take : 1
        })

        if (currentVersion[0].version !== version) returnValue = false
    })

    return returnValue

}

export const tokenCheck = async(token,url, username)=>{
    if (url === '/login' && token === 'LOGIN') return true

    let returnValue = true
    await prismaDB.$transaction(async (tx)=>{
        const userID = await tx.users.findMany({
            where : {
                username : username
            },
            select : {
                users_id : true
            }
        })

        const tokenList = await tx.token.findMany({
            where : {
                token : token,
                user_id : userID[0].users_id,
                valid_until : {
                    gt : new Date()
                }
            }
        })

        if (!tokenList.length) returnValue = false
    })

    return returnValue
}
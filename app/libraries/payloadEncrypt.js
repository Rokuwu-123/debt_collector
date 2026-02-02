import crypto from "crypto";

const algoritm = "aes-256-cbc"

export const encrypt = async(payload, refno)=>{
    const cipherFile = crypto.createCipheriv(algoritm, process.env.keyEncrypt, refno)
    let encryptedData = cipherFile.update(JSON.stringify(payload), "utf8", "hex")
    encryptedData += cipherFile.final('hex')
    return encryptedData
}

export const decrypt = async(payload, refno)=>{
    const cipherFile = crypto.createDecipheriv(algoritm,process.env.keyEncrypt, Buffer.from(refno,"hex"))
    let decryptedData = cipherFile.update(payload, "hex", "utf8")
    decryptedData += cipherFile.final("utf8")
    return JSON.parse(decryptedData)
}
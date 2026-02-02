import fs from "fs"
import { responLog } from "../models/historis_models.js"
const file_name = `./err/ERR_${new Date().toISOString().substring(0, 10).replace(/-/g, '')}.txt`

export default async (respon, error, requestID) => {
    try {

        let sendStatus = 500
        let message = error.message

        if (error.status != 500 && typeof error.status != "undefined") {
            sendStatus = error.status
        }

        if (sendStatus == 500 && error.stack) {

            let callerLine = error.stack.split("\n")[1];
            let myArray = callerLine.split("/");

            let rowErr = myArray[myArray.length - 1].split(":")
            let file = `\\${myArray[myArray.length - 2]}\\${rowErr[0].trim()}`
            let row = rowErr[rowErr.length - 2]

            error.errMessage = `[${error.errMessage ? error.errMessage : message}] pada backend ${file} baris ${row}`
        } else {
            error.errMessage = `${message}`
        }

        let format_file = `${new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }).replace(/\//g, '-')} : (${error.status ? error.status : 500}) ` +
            `${error.errMessage ? error.errMessage : message}\n`

        fs.appendFile(file_name, format_file, () => {

        })

        let errKode = error.kode ? error.kode : '05'

        if (requestID) {
            await responLog(respon, sendStatus, {
                "responseCode": errKode,
                description: message
            }, requestID)

        } else {
            respon
                .status(sendStatus)
                .setHeader("Access-Control-Allow-Origin", "*")
                .send({
                    responseCode: '05',
                    description: message
                })
        }

    } catch (error) {
        console.log(error)
        respon
            .status(500)
            .setHeader("Access-Control-Allow-Origin", "*")
            .send({
                "responseCode": '05',
                "description": `Internal server error (${error.message})`
            })
    }
}
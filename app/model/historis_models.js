// import { bgtr, entr, backtr } from "../libraries/myproc.js"
import { prismaDB } from "../controller/database.js"

function getIPv4(remoteAddress) {
  if (remoteAddress.startsWith("::ffff:")) {
    return remoteAddress.replace("::ffff:", "");
  }
  return remoteAddress;
}

export const requestLog = async (request) => {
  let returnData

  await prismaDB.$transaction(async (tx)=>{
    const data = await tx.log_request.create({
      data : {
        ip_address : getIPv4(request.socket.remoteAddress),
        url : request.url,
        base_url : request.path,
        method : request.method,
        headers : request.headers,
        body_request : request.body
      },
      select : {
        request_id : true
      }
    })
    returnData = data
  })

  return returnData.request_id
}

export const responLog = async (respon, status, payload, requestID) => {
  
  respon
    .status(status)
    .setHeader("Access-Control-Allow-Origin", "*")
    .send(payload)
}

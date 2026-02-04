import { prismaDB } from "../controller/database.js";

export const debitur = async(account)=>{
    let returnData = {}
    
    await prismaDB.$transaction(async(tx)=>{
        
        const data = await tx.kredit.findMany({
            where : {
                rekening : account
            }
        })

        const bulanIni = await tx.$queryRaw`select pokok, bunga, to_char(tanggal,'DD-MM-YYYY') tanggal from 
        jadwal where to_char(tanggal,'YYYYMM') = to_char(current_date,'YYYYMM') and rekening = ${account}`

        const tunggakan = await hitungTunggakan(account)

        returnData = {
            nama : data[0].nama,
            tunggakan : {
                pokok : tunggakan.tunggakanPokok,
                bunga : tunggakan.tunggakanBunga
            },
            xTunggakan : tunggakan.xTunggakanBunga > tunggakan.xTunggakanPokok ? tunggakan.xTunggakanBunga : tunggakan.xTunggakanPokok,
            angsran : {
                pokok : bulanIni[0].pokok,
                bunga : bulanIni[0].bunga
            },
            kewajiban : Number(bulanIni[0].pokok) + Number(bulanIni[0].bunga) + Number(tunggakan.tunggakanPokok) + Number(tunggakan.tunggakanBunga),
            jatuhTempo : bulanIni[0].tanggal
        }

    })

    return returnData

}

async function hitungJadwal(rekening) {
    let jadwal = []
    await prismaDB.$transaction(async (tx)=>{
        jadwal = await tx.jadwal.findMany({
            where : {
                rekening : rekening
            },
            orderBy :{
                tanggal : 'asc'
            },
            select : {
                tanggal : true,
                pokok : true,
                bunga : true
            }
        })

        jadwal = jadwal.map(kolom=>({
            ...kolom,
            bayar_pokok : 0,
            bayar_bunga : 0
        }))

        const bayar = await tx.$queryRaw`select sum(pokok) pokok, sum(bunga) bunga from bayar where rekening = ${rekening}`
        
        let bayarPokok = Number(bayar[0].pokok)
        let bayarBunga = Number(bayar[0].bunga)

        for (let angsur of jadwal){
            
            if (Number(angsur.pokok) <= bayarPokok) {
                angsur.bayar_pokok = angsur.pokok
                bayarPokok -= angsur.bayar_pokok
            } else if(Number(angsur.pokok) > bayarPokok) {
                angsur.bayar_pokok = bayarPokok
                bayarPokok = 0
            }

            if (Number(angsur.bunga) <= bayarBunga) {
                angsur.bayar_bunga = angsur.bunga
                bayarBunga -= angsur.bayar_bunga
            } else if(Number(angsur.bunga) > bayarBunga) {
                angsur.bayar_bunga = bayarBunga
                bayarBunga = 0
            }
        }

    })

    return jadwal

}

async function hitungTunggakan(rekening) {
    const jadwal = await hitungJadwal(rekening)

    let tunggakanPokok = 0, xTunggakanPokok = 0, tunggakanBunga = 0, xTunggakanBunga = 0

    const hariIni = new Date()
    hariIni.setHours(0,0,0,0)

    let jadwalHitung = jadwal.filter(kolom=> {
        const jadwalKredit = new Date(kolom.tanggal)
        jadwalKredit.setHours(0,0,0,0)
        return jadwalKredit.getTime() <= hariIni.getTime()
    })

    for (let nunggak of jadwalHitung){
        if(Number(nunggak.pokok) !== nunggak.bayar_pokok) {
            tunggakanPokok += Number(nunggak.pokok) - nunggak.bayar_pokok
            xTunggakanPokok++
        }
        if(Number(nunggak.bunga) !== nunggak.bayar_bunga) {
            tunggakanBunga += Number(nunggak.bunga) - nunggak.bayar_bunga
            xTunggakanBunga++
        }
    }

    return {
        tunggakanPokok,
        xTunggakanPokok,
        tunggakanBunga,
        xTunggakanBunga
    }
}
import WebSocket from "ws";
import dotenv from 'dotenv'
import {saveData} from './controller/webSocketData.js'

dotenv.config()

console.log("started app successfully")

const ws = new WebSocket(process.env.SOCKETURL)

let currentObj = {open : 0, close : 0, high : 0, low : 0, time : null, volume: 0}

let fiveMinObj = { open : 0, close : 0, high : 0, low : 0, time : null, volume: 0}

let fifteenMinObj = { open : 0, close : 0, high : 0, low : 0, time : null, volume: 0,}

ws.on('message', (data) => {

    data = JSON.parse(data.toString())

    if(data && data.table=='trade' &&  data["data"]) {
        let currentArr = data.data

        if(currentArr){

            currentArr.forEach(item => {
                
                currentObj =  saveData(item, 1, currentObj, `1m_data_bitmex`)  // incoming data, minutes, current Object, collection name
                fiveMinObj =  saveData(item , 5, fiveMinObj, '5m_data_bitmex') // incoming data, minutes, current Object, collection name
                fifteenMinObj =  saveData(item , 15, fifteenMinObj, '15m_data_bitmex')
                
            })
            
        }

    }

})
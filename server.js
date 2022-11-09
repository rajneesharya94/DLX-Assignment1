import WebSocket from "ws";
import dotenv from 'dotenv'
import {saveData} from './controller/webSocketData.js'

dotenv.config()

console.log("App started successfully")

const ws = new WebSocket(process.env.SOCKETURL)

let oneMinObj = {
    open : 0,
    close : 0,
    high : 0,
    low : 0,
    time : null,
    volume: 0,
}


let fiveMinObj = {
    open : 0,
    close : 0,
    high : 0,
    low : 0,
    time : null,
    volume: 0,
}
let fifteenMinObj = {
    open : 0,
    close : 0,
    high : 0,
    low : 0,
    time : null,
    volume: 0,
}

ws.on('message', (data) => {

    data = JSON.parse(data.toString())
    if(data){

        oneMinObj    =  saveData(data, 1, oneMinObj, 'one_min_data_BINANCE') // incoming data, minutes, current Object, collection name
        fiveMinObj    =  saveData(data , 5, fiveMinObj, 'five_min_data_BINANCE') // incoming data, minutes, current Object, collection name
        fifteenMinObj =  saveData(data , 15, fifteenMinObj, 'fifteen_min_data_BINANCE')
            
    }

})
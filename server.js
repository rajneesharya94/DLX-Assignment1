import WebSocket from "ws";
import dotenv from 'dotenv'

dotenv.config()
import {connectDB} from './db.js'
let db = await connectDB()
// let db = client.db('mydb')
console.log("code is working")

const ws = new WebSocket(process.env.SOCKETURL)

let minNow = new Date()
minNow = minNow.getUTCMinutes()
let currentObj = {
    open : 0,
    close : 0,
    high : 0,
    low : 0,
    time : 0,
    volume: 0
}

let fiveMinObj = {...currentObj}
let fifteenMinObj = {...currentObj}

ws.on('message', async (data) => {

    data = JSON.parse(data.toString())

    if(data && data.table=='trade' &&  data["data"]) {
        let currentArr = data.data
        // console.log("?????",data.data)
        // console.log(">>>>>",minNow)

        if(currentArr){

            currentArr.forEach(item => {

                let timestamp = item.timestamp
                let minDatestamp = new Date(timestamp)
                let minTimestamp = minDatestamp.getUTCMinutes()


                if(currentObj.open == 0) currentObj.open = item.price
                if(currentObj.low == 0) currentObj.low = item.price

                if(minNow == minTimestamp){

                    if(minDatestamp > new Date(currentObj.time)) currentObj.close = item.price
                    if(item.price > currentObj.high) currentObj.high = item.price
                    if(item.price < currentObj.low) currentObj.low = item.price

                    currentObj.time = item.timestamp
                    currentObj.volume += item.size

                }

                else {
                    if(currentObj){
                        //saving current obj into db
                        console.log("dbbbbbb", currentObj)
                        db.collection('test10').insertOne({...currentObj})
                        console.log(">>>", minNow , minTimestamp)
                    }
                    minNow = minTimestamp
                    currentObj.open = currentObj.close
                    item.price > currentObj.close ? currentObj.high = item.price : currentObj.high = currentObj.close

                    item.price < currentObj.close ? currentObj.low = item.price : currentObj.low = currentObj.close

                    currentObj.close = item.price

                    currentObj.volume = item.size

                }

                
            })
            
        }

      


    }



})
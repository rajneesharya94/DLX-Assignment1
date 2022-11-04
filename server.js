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
    volume: 0,
    num: 0
}

let fiveMinObj = {...currentObj, num :0}
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
                        console.log("dbbb11111bbb", currentObj)
                        try{
                            // console.log("?????111111111111")
                            currentObj.num += 1
                            db.collection('one_min_obj').insertOne({...currentObj})
                            // console.log("?????????22222");
                        }
                        catch(err){
                            console.log("?????",err)
                        }
                        console.log(">>>", minNow , minTimestamp)

                        console.log("here is the num", currentObj.num)

                        if(fiveMinObj.open == 0) fiveMinObj.open = currentObj.open
                        if(fiveMinObj.low == 0) fiveMinObj.low = currentObj.low
                        fiveMinObj.volume += currentObj.volume

                        if(currentObj.num%5 == 0){
                            fiveMinObj.close = currentObj.close
                            if(currentObj.high>fiveMinObj.high) fiveMinObj.high = currentObj.high
                            if(currentObj.low<fiveMinObj.low) fiveMinObj.low = currentObj.low

                            fiveMinObj.num++
                            fiveMinObj.time = new Date().toUTCString()
                            db.collection('five_min_obj').insertOne({...fiveMinObj})
                            fiveMinObj.volume = 0

                            fiveMinObj.open = fiveMinObj.close

                            if(fifteenMinObj.open==0) fifteenMinObj.open = fiveMinObj.open
                            if(fifteenMinObj.low == 0) fifteenMinObj.low = fiveMinObj.low
                            fifteenMinObj.volume += fiveMinObj.volume

                            if(fiveMinObj.num%3==0){

                                fifteenMinObj.close = fiveMinObj.close
                               if(fiveMinObj.high>fifteenMinObj.high) fifteenMinObj.high = fiveMinObj.high
                               if(fiveMinObj.low<fifteenMinObj.low) fifteenMinObj.low = fiveMinObj.low
                                fifteenMinObj.time = new Date().toUTCString()
                                db.collection('fifteen_min').insertOne({...fifteenMinObj})

                                fifteenMinObj.open = fifteenMinObj.close
                                // fiveMinObj.num +=1
                                fifteenMinObj.volume = 0

                            }
                            else{


                                if(fiveMinObj.high>fifteenMinObj.high) fifteenMinObj.high = fiveMinObj.high
                                if(fiveMinObj.low<fifteenMinObj.low) fifteenMinObj.low = fiveMinObj.low

                            }
                            
                        }
                        else{
                            
                            // fiveMinObj.close = currentObj.close
                           if(currentObj.high>fiveMinObj.high) fiveMinObj.high = currentObj.high
                           if(currentObj.low<fiveMinObj.low) fiveMinObj.low = currentObj.low

                        }
                        
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
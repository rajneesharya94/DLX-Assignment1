import dotenv from 'dotenv'

dotenv.config()
import {connectDB} from '../db.js'
let db = await connectDB()

function roundOffHigherFunc (minutes, date = new Date()){
    const ms = 1000 * 60 * minutes;
      return new Date(Math.ceil(date.getTime() / ms) * ms);
}
function roundOffLowerFunc (minutes, date = new Date()){
    const ms = 1000 * 60 * minutes;
      return new Date(Math.floor(date.getTime() / ms) * ms);
}

function getTimeArr (start, end, minutes) {
    let arr = []
    let diff = (end - start)/(60000*minutes)
    // while(i=diff){
        
        let roundOffStart = roundOffHigherFunc(minutes, start)
        let roundOffPreStart = roundOffLowerFunc(minutes,start)
        // arr.push(roundOffPreStart)
        // i++
    
    
    for(let i=0; i<=diff; i++){
        console.log(start)
        arr.push(roundOffStart)
        roundOffStart = new Date(roundOffStart)
        roundOffStart.setMinutes(roundOffStart.getMinutes()+minutes)
        // console.log("???", arr, diff,i, roundOffStart)
    }
    return arr
}


export const exchangeData = async(req, res) => {
    let {collectionName, startTime, endTime, duration} = req.query

    startTime = new Date(startTime)
    endTime = new Date(endTime)
    console.log(startTime, endTime)

    
    console.log("controller", collectionName)

   db.collection(collectionName).aggregate([
        {
            '$match':{
                'time':{'$gte':startTime, '$lte':endTime}
            }
            
        }

    ]).toArray().then(r=>{
        console.log("????r??",r)
        if(r && r.length ==0) return res.status(400).send({"error":"data not found for given time"})
        
        let openArr = []
        let closeArr = []
        let highArr = []
        let lowArr = []
        let volArr = []
        let timeArr = getTimeArr(startTime, endTime,duration )
        timeArr.forEach(item=>{
            console.log("timearr", timeArr)
            let flag = true
                for(let i=0; i<r.length; i++ ){
                    console.log("condition",item.valueOf()==r[i].time.valueOf() )
                    if(item.valueOf()==r[i].time.valueOf()){
                        flag = false
                        openArr.push(r[i].open)
                        closeArr.push(r[i].close)
                         highArr.push(r[i].high)
                        lowArr.push(r[i].low)
                        volArr.push(Math.round(r[i].volume * 100)/100)
                    }
                    
                }
                console.log("flag",flag)
                if(flag) {
                        openArr.push(null)
                        closeArr.push(null)
                        highArr.push(null)
                        lowArr.push(null)
                        volArr.push(null)

                }
                
            })
            return res.status(200).json({'result':{openArr,closeArr,highArr,lowArr,volArr}})
    })
    

}
import dotenv from 'dotenv'

dotenv.config()
import {connectDB} from '../db.js'
let db = await connectDB()

function roundOffHigherFunc (minutes, date = new Date()){
    const ms = 1000 * 60 * minutes;
      return new Date(Math.ceil(date.getTime() / ms) * ms);
}

function getTimeArr (start, end, minutes) {
    let arr = []
    let diff = (end - start)/(60000*minutes)
    // while(i=diff){
        
        let roundOffStart = roundOffHigherFunc(minutes, start)
        // arr.push(roundOffStart)
        // i++
    
    
    for(let i=0; i<=diff; i++){
        console.log(start)
        arr.push(roundOffStart)
        roundOffStart = new Date(roundOffStart)
        roundOffStart.setMinutes(roundOffStart.getMinutes()+minutes)
        console.log("???", arr, diff,i, roundOffStart)
    }
    return arr
}


export const exchangeData = async(req, res) => {
    let {collectionName, startTime, endTime, duration} = req.query

    startTime = new Date(startTime)
    endTime = new Date(endTime)
    // console.log(startTime, endTime)

    
    // console.log("controller", collectionName)

   db.collection(collectionName).aggregate([
        {
            '$match':{
                'time':{'$gte':startTime, '$lte':endTime}
            }
            
        }

    ]).toArray().then(r=>{
        // console.log(r)
        let openArr = []
        let timeArr = getTimeArr(startTime, endTime,duration )
            console.log("timearr", timeArr)
            timeArr.forEach(item=>{
                
            })
            
            
            return res.send({'result':timeArr})
    })
    

}
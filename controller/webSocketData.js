import {connectDB} from '../db.js'
let db = await connectDB()
import {runProd} from '../kafka/producer'

function roundOffHigherFunc (minutes, date = new Date()){
    const ms = 1000 * 60 * minutes;
      return new Date(Math.ceil(date.getTime() / ms) * ms);
}

export let saveData = (item, minutes, currentObj, collectionName) => {


    if(item == null){
        //push in producer
    }

    // console.log(currentObj.time, item.T)
    // let roundOffHigher = currentObj.time? currentObj.time : roundOffHigherFunc(minutes)
    if(currentObj.time == null){
        currentObj.time = roundOffHigherFunc(minutes)
    }
    let itemRoundOff = new Date(item.T)
    // itemRoundOff.setMilliseconds(0)

    item.p = Number(item.p)
    item.q = Number(item.q)
    if(currentObj.open == 0) currentObj.open = item.p
    if(currentObj.low == 0) currentObj.low = item.p

    // console.log(currentObj.time,itemRoundOff,currentObj.time>itemRoundOff, currentObj)

    if(new Date(currentObj.time).valueOf() >= itemRoundOff.valueOf()){
        // console.log("iff")

        //if roundOffTime is same as data T then update current obj else save it 

        currentObj.close = item.p
        if(item.p > currentObj.high) currentObj.high = item.p
        if(item.p < currentObj.low) currentObj.low = item.p

        currentObj.volume += item.q
    }
    // else if(new Date(currentObj.time).valueOf() == itemRoundOff.valueOf()){

    //     let sameTime = new Date(item.T)
    //     console.log("sameTime", sameTime)
    //     sameTime.setMilliseconds(sameTime.getMilliseconds()+1)
    //     console.log("sameTime11", sameTime)
    //     currentObj.time = roundOffHigherFunc(minutes, sameTime)
    //     console.log("equal")
    //     currentObj.open = currentObj.close
    //     item.p > currentObj.close ? currentObj.high = item.p : currentObj.high = currentObj.close

    //     item.p < currentObj.close ? currentObj.low = item.p : currentObj.low = currentObj.close

    //     currentObj.close = item.p

    //     currentObj.volume = item.q

    // }

    else {
        console.log(currentObj.time,itemRoundOff,currentObj.time>itemRoundOff, currentObj)

    //    db.collection(collectionName).insertOne({...currentObj, createdAt: new Date().toISOString()})

        currentObj.time = roundOffHigherFunc(minutes, new Date(item.T))
        currentObj.open = currentObj.close
        item.p > currentObj.close ? currentObj.high = item.p : currentObj.high = currentObj.close

        item.p < currentObj.close ? currentObj.low = item.p : currentObj.low = currentObj.close

        currentObj.close = item.p

        currentObj.volume = item.q

    }
    // currentObj.time = roundOffHigher

    // console.log(currentObj)
    return currentObj;


}
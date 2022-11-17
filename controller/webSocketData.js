import {connectDB} from '../db.js'
let db = await connectDB()

function roundOffHigherFunc (minutes, date = new Date()){
    const ms = 1000 * 60 * minutes;
      return new Date(Math.ceil(date.getTime() / ms) * ms);
}

export let saveData = (item, minutes, currentObj, collectionName) => {

    console.log(currentObj.time, item.timestamp)
    // let roundOffHigher = currentObj.time? currentObj.time : roundOffHigherFunc(minutes)
    if(currentObj.time == null){
        currentObj.time = roundOffHigherFunc(minutes)
    }
    let itemRoundOff = new Date(item.timestamp)
    // itemRoundOff.setMilliseconds(0)


    if(currentObj.open == 0) currentObj.open = item.price
    if(currentObj.low == 0) currentObj.low = item.price

    console.log(currentObj.time,itemRoundOff,currentObj.time>itemRoundOff)

    if(new Date(currentObj.time).valueOf() >= itemRoundOff.valueOf()){

        //if roundOffTime is same as data timestamp then update current obj else save it 

        currentObj.close = item.price
        if(item.price > currentObj.high) currentObj.high = item.price
        if(item.price < currentObj.low) currentObj.low = item.price

        currentObj.volume += item.size
    }

    else {
        db.collection(collectionName).insertOne({...currentObj})

        currentObj.time = roundOffHigherFunc(minutes, new Date(item.timestamp))
        currentObj.open = currentObj.close
        item.price > currentObj.close ? currentObj.high = item.price : currentObj.high = currentObj.close

        item.price < currentObj.close ? currentObj.low = item.price : currentObj.low = currentObj.close

        currentObj.close = item.price

        currentObj.volume = item.size

    }
    // currentObj.time = roundOffHigher

    console.log(currentObj)
    return currentObj;


}
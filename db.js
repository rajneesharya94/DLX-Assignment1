import { MongoClient } from 'mongodb';
import {config} from 'dotenv'
config()


var url = process.env.MONGO_URI;
console.log(">>>>", url)


export const connectDB = async() => {
    try {

        const client = new MongoClient(url)
       let db =  (await client.connect()).db('mydb')
        console.log("db started")

        return db
    }
    catch (err) { console.log("errror",err) 
    }
}

// module.exports = connectDB


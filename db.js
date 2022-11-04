import { MongoClient } from 'mongodb';


var url = "mongodb://127.0.0.1:27017/mydb";

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


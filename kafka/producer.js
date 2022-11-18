import {Kafka, logLevel, CompressionTypes} from 'kafkajs';
import dotenv from 'dotenv'
dotenv.config()

const host = '3.133.74.32'
console.log('here is the ip', host)

const kafka = new Kafka({
    brokers:[`${host}:9092`,`${host}:9093`],
    clientId:'example-producer'
})

const topic = 'topic-test'


// const sendMessage = 

const producer = kafka.producer()
export const runProd = async (data) =>{
  console.log("calllledd run prod")
  await producer.connect()
  // console.log({producer});
    // setInterval(() => {
      producer
        .send({
          topic,
          // compression: CompressionTypes.GZIP,
          messages:data
        })
        .then(console.log("Sent to kafka"))
        .catch(e => console.error(`[example/producer] ${e.message}`, e))
    // },2000)
}

// runProd().catch(e => console.error(`[example/producer] ${e.message}`, e))
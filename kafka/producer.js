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
const producer = kafka.producer()

const sendMessage = () => {
    return producer
      .send({
        topic,
        // compression: CompressionTypes.GZIP,
        messages:[ { key: 'key-1', value: 'value-1-2022-11-16T12:38:14.178Z' } ],
      })
      .then(console.log)
      .catch(e => console.error(`[example/producer] ${e.message}`, e))
  }

const run = async () =>{
    await producer.connect()
    setInterval(sendMessage,1000)
}

run().catch(e => console.error(`[example/producer] ${e.message}`, e))
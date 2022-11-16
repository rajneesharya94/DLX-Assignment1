import {Kafka, logLevel, CompressionTypes} from 'kafkajs';

const host = '3.133.74.32'

const kafka = new Kafka({
    brokers:[`${host}:9092`,`${host}:9093`],
    clientId:'example-producer'
})

const topic = 'topic-test'

const consumer = kafka.consumer({'groupId':'test-group'})

const run = async () => {
    consumer.connect()
    consumer.subscribe({topic,fromBeginning:true})
    consumer.run({
        eachMessage: async({topic, partition, message }) => {
            const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
            console.log(`- ${prefix} ${message.key}#${message.value}`)
        }
    })
}

run().catch(e => console.error(`[example/consumer] ${e.message}`, e))

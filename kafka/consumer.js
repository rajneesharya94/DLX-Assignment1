import {Kafka, logLevel, CompressionTypes} from 'kafkajs';
import { createServer } from 'http';
import { WebSocketServer, WebSocket} from 'ws';


//creating a server
const server = createServer((request, response)=>{
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write("message ==> Server is live.");
    response.end();
});
const wss = new WebSocketServer({ server });


const host = '3.133.74.32'

//getting data from consumer
const kafka = new Kafka({
    brokers:[`${host}:9092`,`${host}:9093`],
    clientId:'example-producer'
})

const topic = 'topic-test'

const consumer = kafka.consumer({'groupId':'rajneesh'})
consumer.connect()
consumer.subscribe({topic,fromBeginning:false})

//creating a websocket connection with client
wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
      console.log('received:', data);
    });
  
    ws.send('something');
    ws.on("close", (req) => {
      console.log("Websocket client connection closed", req);
  })
  });
  
server.listen(3000, ()=>{
    console.log('server started')
});

const runConsumer = async () => {
    consumer.run({
        eachMessage: async({topic, partition, message }) => {
            // const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
            // console.log(`- ${prefix} ${message.key}#${message.value}`)
            console.log("consumer data", message.value.toString())
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(message.value.toString());
                }
              });
        }
    })
}

runConsumer().catch(e => console.error(`[example/consumer] ${e.message}`, e))

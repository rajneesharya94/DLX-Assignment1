import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const server = createServer((request, response)=>{
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write("message ==> Server is live.");
    response.end();
});
const wss = new WebSocketServer({ server });

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
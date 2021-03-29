import SocketServer from "./socketServer.js"
import Event from 'events'
import { constants } from "./constants.js"
import Controller from "./controller.js"

const eventEmitter = new Event()

const port = process.env.PORT || 9898
const socketServer = new SocketServer({ port })
const server = await socketServer.initialize(eventEmitter)
console.log('Socket server listening on port ', server.address().port)

const controller = new Controller({ socketServer })
eventEmitter.on(constants.events.NEW_USER_CONNECTED, controller.onNewConnection.bind(controller))


/*
async function testServer(){
    const options = {
        port: 9898,
        host: 'localhost',
        headers: {
            Connection: 'Upgrade',
            Upgrade: 'websocket'
        }
    }

    const http = await import('http')
    const req = http.request(options)
    req.end()

    req.on('upgrade', (req, socket) => {
        socket.on('data', data => {
            console.log('client received', data.toString())
        })

        setInterval(() => {
            socket.write('Hello from client!')
        }, 1000);
    })
}

await testServer()
*/
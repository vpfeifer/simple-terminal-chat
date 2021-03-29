import Event from 'events'

export default class SocketClient {
    #serverConnection = {}
    #serverListener = new Event()

    constructor({ hostname, port, protocol }) {
        this.hostname = hostname
        this.port = port
        this.protocol = protocol
    }

    sendMessage(event, message) {
        this.#serverConnection.write(JSON.stringify({ event, message }))
    }

    attachEvents(events) {
        this.#serverConnection.on('data', data => {
            try{
                data.toString()
                .split('\n') //split messages
                .filter(line => !!line) //remove blanks
                .map(JSON.parse)
                .map(({ event, message }) => {
                    this.#serverListener.emit(event, message)
                })
            }catch(error){
                console.error('Could not attach events', data.toString(), error)
            }
            
        })

        for (const [key, value] of events) {
            this.#serverListener.on(key, value)
        }
    }

    async createConnection(){
        const options = {
            port: this.port,
            host: this.hostname,
            headers: {
                Connection: 'Upgrade',
                Upgrade: 'websocket'
            }
        }
    
        const http = await import(this.protocol)
        const req = http.request(options)
        req.end()

        return new Promise(resolve => {
            req.on('error', () => console.log("Could not connect with server. Please, try again later."))
            req.once('upgrade', (res, socket) => resolve(socket))
        })
    }

    async initialize() {
        this.#serverConnection = await this.createConnection()
        console.log('Connection established!')
    }
}
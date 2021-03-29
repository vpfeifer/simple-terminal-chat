import { constants } from "./constants.js"

export default class Controller {
    #users = new Map()
    #rooms = new Map()
    constructor({ socketServer }) {
        this.socketServer = socketServer
    }

    onNewConnection(socket) {
        const { id } = socket
        console.log('New connection established with id = ', id)
        const userData = { id, socket }
        this.#updateUserData(id, userData)

        socket.on('data', this.#onSocketData(id))
        socket.on('error', this.#onSocketEnd(id))
        socket.on('end', this.#onSocketEnd(id))
    }

    async joinRoom(socketId, data) {
        const userData = data
        console.log(`${userData.username} joined! ${[socketId]}`)
        const user = this.#updateUserData(socketId, userData)

        const { roomId } = userData
        const users = this.#joinUserOnRoom(roomId, user)

        const currentUsers = Array.from(users.values())
            .map(
                ({ id, username }) => ({ username, id})
            )
        
        this.socketServer.sendMessage(user.socket, constants.events.UPDATE_USERS, currentUsers)

        this.broadcast({ 
            socketId,
            roomId,
            message: { id: socketId, username: userData.username},
            event: constants.events.NEW_USER_CONNECTED
        })
    }

    broadcast({ socketId, roomId, event, message, includeCurrentSocket = false }) {
        const usersOnRoom = this.#rooms.get(roomId)

        for(const [key, user] of usersOnRoom) {
            if(!includeCurrentSocket && key === socketId) continue;
            this.socketServer.sendMessage(user.socket, event, message)
        }
    }

    message(socketId, data) {
        const { username, roomId } = this.#users.get(socketId)

        this.broadcast({
            roomId,
            socketId,
            event: constants.events.MESSAGE,
            message: { username, message: data },
            includeCurrentSocket: true
        })
    }

    #joinUserOnRoom(roomId, user) {
        const usersOnRoom = this.#rooms.get(roomId) ?? new Map()
        usersOnRoom.set(user.id, user)
        this.#rooms.set(roomId, usersOnRoom)
        return usersOnRoom
    }


    #onSocketData(id) {
        return data => {
            try {
                const { event, message } = JSON.parse(data)
                this[event](id, message)
            } catch (error) {
                console.error("Wrong event format!", data.toString(), error)
            }
        }
    }

    #onSocketEnd(id) {
        return _ => {
            const { username, roomId } = this.#users.get(id)
            this.#disconnectUser(id, roomId)
            console.log(username, 'disconnected', id)
            this.broadcast({
                roomId,
                message: { id, username },
                socketId: id,
                event: constants.events.USER_DISCONNECTED
            })
        }
    }

    #disconnectUser(id, roomId) {
        this.#users.delete(id)
        const usersOnRoom = this.#rooms.get(roomId)
        usersOnRoom.delete(id)

        this.#rooms.set(roomId, usersOnRoom)
    }

    #updateUserData(socketId, userData) {
        const users = this.#users
        const user = users.get(socketId) ?? {}

        const updatedUserData = {
            ...user,
            ...userData
        }

        users.set(socketId, updatedUserData)

        return users.get(socketId)
    }
}
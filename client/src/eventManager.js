import { constants } from "./constants.js"

export default class EventManager {
    #users = new Map()
    constructor({ componentEmitter, socketClient }) {
        this.componentEmitter = componentEmitter
        this.socketClient = socketClient
    }

    joinRoomAndWaitForMessages(data) {
        this.socketClient.sendMessage(constants.events.socket.JOIN_ROOM, data)
        this.componentEmitter.on(constants.events.app.MESSAGE_SENT, msg => {
            this.socketClient.sendMessage(constants.events.socket.MESSAGE, msg)
        })
    }

    updateUsers(users) {
        const connectedUsers = users
        connectedUsers.forEach(({ id, username }) => this.#users.set(id, username))
        this.#updateOnlineUsers()
    }

    newUserConnected(message) {
        const user = message
        this.#users.set(user.id, user.username)
        this.componentEmitter.emit(constants.events.app.USER_JOINED, { username: user.username, status: 'joined'})
        this.#updateOnlineUsers()
    }

    userDisconnected(user) {
        const { username, id } = user
        this.#users.delete(id)

        this.componentEmitter.emit(constants.events.app.USER_LEFT, { username: username, status: 'left'})
        this.#updateOnlineUsers()
    }

    message(message) {
        this.componentEmitter.emit(
            constants.events.app.MESSAGE_RECEIVED,
            message
        )
    }

    #updateOnlineUsers(){
        this.componentEmitter.emit(
            constants.events.app.USER_STATUS_UPDATED,
            Array.from(this.#users.values())
        )
    }

    getEvents() {
        const functions = Reflect.ownKeys(EventManager.prototype)
                .filter(fn => fn !== 'constructor')
                .map(name => [name, this[name]. bind(this)])
        
        return new Map(functions)
    }
}
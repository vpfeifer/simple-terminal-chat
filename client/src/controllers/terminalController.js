import TerminalLayoutBuilder from "../builders/terminalLayoutBuilder.js"
import {constants} from "../constants.js"

export default class TerminalController{
    constructor() {}

    #usersColors = new Map()

    #randomColor(){
        return `#${((1 << 24) * Math.random() | 0).toString(16)}-fg`
    }

    #getUserColor(username){
        if(this.#usersColors.has(username)) 
            return this.#usersColors.get(username)

        const color = this.#randomColor()
        this.#usersColors.set(username, color)

        return color
    }

    #onInputReceived(eventEmitter){
        return function(){
            const message = this.getValue()
            eventEmitter.emit(constants.events.app.MESSAGE_SENT, message)
            this.clearValue()
        }
    }

    #onMessageReceived({screen, messagesBox}){
        return msg => {
            const { username, message } = msg
            const color = this.#getUserColor(username)
            messagesBox.addItem(`{${color}}{bold}${username}{/} : ${message}`)
            screen.render()
        }
    }

    #onUserActivity({screen, historyBox}){
        return msg => {
            const {username, status} = msg
            historyBox.addItem(`${username} ${status}`)
            screen.render()
        }
    }

    #onStatusChanged({ screen, usersBox }) {
        return users => {
            const { content } = usersBox.items.shift()
            usersBox.clearItems()
            usersBox.addItem(content)

            users.forEach(username => {
                const color = this.#getUserColor(username)
                usersBox.addItem(`{${color}}{bold}${username}{/}`)
            })

            screen.render()
        }
    }

    #registerEvents(eventEmitter, components){
        eventEmitter.on(constants.events.app.MESSAGE_RECEIVED, this.#onMessageReceived(components))
        eventEmitter.on(constants.events.app.USER_JOINED, this.#onUserActivity(components))
        eventEmitter.on(constants.events.app.USER_LEFT, this.#onUserActivity(components))
        eventEmitter.on(constants.events.app.USER_STATUS_UPDATED, this.#onStatusChanged(components))
    }

    async initializeTable(eventEmitter){
        const components = new TerminalLayoutBuilder()
            .setScreen({title: "Simple Terminal Chat"})
            .setLayout()
            .setTextInput(this.#onInputReceived(eventEmitter))
            .setMessagesBox()
            .setUsersBox()
            .setHistoryBox()
            .build()
        
        this.#registerEvents(eventEmitter, components)

        components.input.focus()
        components.screen.render()
    }
}
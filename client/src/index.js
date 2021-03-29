#!/usr/bin/env node

import Events from "events"
import CliArgs from "./cliArgs.js"
import SocketClient from './socketClient.js'
import TerminalController from "./controllers/terminalController.js";
import EventManager from "./eventManager.js";

const componentEmitter = new Events()

const [nodePath, filePath, ...commands] = process.argv
const config = CliArgs.parse(commands)

const socketClient = new SocketClient(config)
await socketClient.initialize()

const eventManager = new EventManager({ componentEmitter, socketClient })

const events = eventManager.getEvents()
socketClient.attachEvents(events)

const data ={
    roomId: config.room,
    username: config.username
}

eventManager.joinRoomAndWaitForMessages(data)

const controller = new TerminalController()
await controller.initializeTable(componentEmitter)
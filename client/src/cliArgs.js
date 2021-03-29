import { constants } from "./constants.js"

export default class CliArgs {
    constructor({host = constants.SERVER_URL, room, username}){
        this.host = host
        this.room = room,
        this.username = username

        const {hostname, port, protocol} = new URL(host)
        this.protocol = protocol.replace(/\W/, '')
        this.hostname = hostname
        this.port = port
    }

    static parse(comandArguments){
        const cmds = new Map()
        for(const item in comandArguments){

            const index = parseInt(item)
            const command = comandArguments[item]
            const prefix = '--'

            if(!command.includes(prefix)) continue;

            cmds.set(
                command.replace(prefix, ''),
                comandArguments[index + 1]
            )
        }

        return new CliArgs(Object.fromEntries(cmds))
    }
}
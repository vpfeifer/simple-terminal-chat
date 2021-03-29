import blessed from 'blessed'

export default class TerminalLayoutBuilder{
    #screen
    #layout
    #input
    #messagesBox
    #usersBox
    #historyBox
    
    constructor() {}

    #baseComponent(){
        return {
            border: 'line',
            mouse: true,
            keys: true,
            top: 0,
            scrollbar: {
                ch: '',
                inverse: true
            },
            tags: true
        }
    }

    setScreen({title}){
        this.#screen = blessed.screen({
            smartCSR: true,
            title
        })

        this.#screen.key(['escape','C-c'], () => process.exit(0))

        return this
    }

    setLayout(){
        this.#layout = blessed.layout({
            parent: this.#screen,
            width: '100%',
            height: '100%'
        })

        return this
    }

    setTextInput(onEnterPressed){
        const input = blessed.textarea({
            parent: this.#screen,
            bottom: 0,
            height: '10%',
            inputOnFocus: true,
            padding: {
                top: 1,
                left: 2
            },
            style: {
                fg: '#f6f6f6',
                bg: '#353535',
            }
        })

        input.key('enter', onEnterPressed)
        this.#input = input

        return this
    }

    setMessagesBox(){
        this.#messagesBox = blessed.list({
            ...this.#baseComponent(),
            parent: this.#layout,
            align: 'left',
            width: '50%',
            height: '90%',
            items: ['{bold}MESSAGES{/bold}']
        })

        return this
    }

    setUsersBox(){
        this.#usersBox = blessed.list({
            ...this.#baseComponent(),
            parent: this.#layout,
            width: '25%',
            height: '90%',
            items: ['{bold}ONLINE USERS{/bold}']
        })

        return this
    }

    setHistoryBox(){
        this.#historyBox = blessed.list({
            ...this.#baseComponent(),
            parent: this.#layout,
            width: '25%',
            height: '90%',
            style: {
                fg: 'yellow'
            },
            items: ['{bold}HISTORY{/bold}']
        })

        return this
    }

    build(){
        const components = {
            screen: this.#screen,
            input: this.#input,
            messagesBox: this.#messagesBox,
            usersBox: this.#usersBox,
            historyBox: this.#historyBox
        }

        return components
    }
}
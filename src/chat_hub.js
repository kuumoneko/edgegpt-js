const { EventEmitter } = require('events');
const { WebSocket } = require('ws')
const { createChatRequest, DELIMITER, headers, conversation_style } = require('./Utility.js');


class ChatHub extends EventEmitter {
    constructor(conversation) {
        super()
        this.conversation = conversation
    }

    /**
     * Initialize the WebSocket connection
     * @returns {Promise<WebSocket>}
     */
    async init() {
        return new Promise((resolve) => {
            this.socket = new WebSocket('wss://sydney.bing.com/sydney/ChatHub', { headers: headers })

            this.socket.addEventListener('open', () => {
                this.send({ protocol: 'json', version: 1 })
                resolve(this.socket)
            })

            this.socket.addEventListener('message', ({ data }) => {
                const items = data.toString().split(DELIMITER)
                for (const item of items) {
                    if (!item) continue

                    const response = JSON.parse(item)
                    if (response?.type === 1) {
                        try {
                            // noinspection JSUnresolvedReference
                            const { text } = response.arguments[0].messages[0].adaptiveCards[0].body.pop()
                            this.emit('message', text)
                        } catch { }
                    } else if (response?.type === 2) {
                        this.emit('final', response)
                    }
                }
            })
            this.socket.addEventListener('close', (...args) => this.emit('close', ...args))
            this.socket.addEventListener('error', (...args) => this.emit('error', ...args))
        })
    }

    /**
     * Sends a prompt to the server
     * @param prompt
     * @returns {Promise<Function>}
     */
    async ask(prompt, mode = conversation_style.balanced) {
        if (!this.socket || this.socket.readyState === WebSocket.CLOSED) await this.init()
        var c = this.create(this.conversation, prompt, mode)
        // console.log(c.arguments[0])
        this.send(c)
    }

    create(conversation, prompt, mode) {
        return createChatRequest(conversation, prompt, mode);
    }

    /**
     * Sends a message
     * @param msg
     */
    send(msg) {
        this.socket.send(JSON.stringify(msg) + DELIMITER)
    }

    /**
     * Closes the WebSocket connection
     */
    close() {
        if (this.socket) this.socket.close()
    }
}

module.exports = { ChatHub }
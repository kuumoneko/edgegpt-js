const { headers, conversation_style, getHeaders } = require('./Utility.js')
const axios = require('axios')
const { ChatHub } = require('./chat_hub.js')

class ChatBot {
  constructor(cookie_U) {
    this.headers = getHeaders(cookie_U)
  }

  async init() {
    const { data: conversation } = await axios.get('https://www.bing.com/turing/conversation/create', { headers: this.headers })
    this.chatHub = new ChatHub(conversation)
  }

  async ask(prompt, mode = conversation_style.balanced) {
    this.mode = mode
    return new Promise((resolve) => {
      if (this.chatHub) {
        this.chatHub.once('final', ({ item }) => {
          // noinspection JSUnresolvedReference
          // console.log(item)
          // resolve(item.messages[item.messages.length - 1].text)
          if (item.messages && item.messages.length > 0) {
            resolve(item.messages[item.messages.length - 1].text);
          } else {
            resolve("No messages available");
          }
        })
      }
      this.chatHub.ask(prompt, mode).then()
    })
  }

  close() {
    if (this.chatHub) this.chatHub.close()
  }

  async reset() {
    await this.init()
  }
}

module.exports = {
  ChatBot
}

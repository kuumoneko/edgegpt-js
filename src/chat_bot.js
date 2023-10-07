const { headers, conversation_style, getHeaders } = require("./Utility.js");
const { ChatHub } = require("./chat_hub.js");
const { fetch } = require("fetch-undici");

const { Agent } = require("undici");

class ChatBot {
  constructor(cookie_U) {
    this.headers = getHeaders(cookie_U);
  }

  async init() {
    this.headers = Object.fromEntries(
      Object.entries(this.headers).filter(([, value]) => value !== undefined)
    );

    const fetchOptions = {
      headers: this.headers,
    };

    fetchOptions.dispatcher = new Agent({ connect: { timeout: 20_000 } });

    const res = await fetch(
      `https://www.bing.com/turing/conversation/create`,
      fetchOptions
    );

    var conversation = JSON.parse(await res.text());
    conversation["conversationSignature"] = res.headers.get(
      "x-sydney-encryptedconversationsignature"
    );


    this.chatHub = new ChatHub(conversation);
  }

  async ask(prompt, mode = conversation_style.balanced) {
    this.mode = mode;
    return new Promise((resolve) => {
      if (this.chatHub) {
        this.chatHub.once("final", ({ item }) => {
          resolve(item.messages[item.messages.length - 1].text);
        });
      }
      this.chatHub.ask(prompt, mode).then();
    });
  }

  close() {
    if (this.chatHub) this.chatHub.close();
  }

  async reset() {
    await this.init();
  }
}

module.exports = ChatBot;

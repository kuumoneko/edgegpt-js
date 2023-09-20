const { ChatBot } = require('bingai-js');
const { conversation_style } = require('./src/Utility');

const cookie = ""

const a = new ChatBot(cookie);

async function test() {
    await a.init();

    console.log( await a.ask('' , conversation_style.balanced))
}

test()
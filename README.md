# Bing AI API using node js

## Update v1.7.5:

> Support Typescript

# Install

```
npm i bingai-js@1.7.5
or
npm i bingai-js
```

# Getting cookie

1. Go to https://bing.com/chat
2. Copy cookies value named `_U` by using cookie editor extensions

# Usage

```js
// if using ESM
import { ChatBot, conversation_style } from "bingai-js";
import promptSync from "prompt-sync";

// if using commonJS
const { ChatBot, conversation_style } = require("bingai-js/index.cjs");
const promptSync = require("prompt-sync");



const pr = promptSync();

const cookie = "Your-Cookie-U-here";

const a = new ChatBot(cookie);

async function test() {
  await a.init();
  var i = 0;
  await a.chatHub.init().then(async () => {
    while (true) {
      const prompt = pr("You: ");
      /**
       *   balanced : conversation_style.balanced
       *   creative : conversation_style.creative
       *   precise  : conversation_style.precise
       */
      const res = await a.ask(prompt, conversation_style.balanced, i);
      i++;
      console.log(`Bot: ${res}`);
    }
  });
}

test();
```

```shell
node index.js
```

# Contributors

<a href="https://github.com/kuumoneko/edgegpt-js/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=kuumoneko/edgegpt-js" />
</a>

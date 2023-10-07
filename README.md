# Bing AI API using node js

## Update:

> Support using `encryptedconversationsignature` from header ot fix error

# Install

```
npm i bingai-js
```

# Getting cookie

1. Go to https://bing.com/chat
2. Copy cookies value named `_U` by using cookie editor extensions

# Usage

```shell
/**
 * test.js
 */
const { ChatBot , conversation_style } = require('bingai-js');

const cookie = "Your-Cookie-U-here"

const a = new ChatBot(cookie);

async function test(prompt) {
    await a.init();
    /**
    *   balanced : conversation_style.balanced
    *   creative : conversation_style.creative
    *   precise  : conversation_style.precise
    */
    console.log( await a.ask(prompt , conversation_style.balanced))
}

test("Your-prompt");
```

```
node test.js
```

# Contributors

<a href="https://github.com/kuumoneko/edgegpt-js/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=kuumoneko/edgegpt-js" />
</a>

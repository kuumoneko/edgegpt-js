# Google Bard API using node js

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
const { ChatBot } = require('bingai-js');
const { conversation_style } = require('./src/Utility');

const cookie = "Your-Cookie-U-here"

const a = new ChatBot(cookie);

async function test() {
    await a.init();


    /**
    *   balanced : conversation_style.balanced
    *   creative : conversation_style.creative
    *   precise  : conversation_style.precise
    */
    console.log( await a.ask(prompt , conversation_style.balanced))
}

test()
```

```
node testing.js
```

# Contributors


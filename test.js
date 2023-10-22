const { ChatBot, conversation_style } = require("./index");

const cookie = "Your-Cookie-U-here";

const a = new ChatBot(cookie);

async function test(prompt) {
  await a.init();
  /**
   *   balanced : conversation_style.balanced
   *   creative : conversation_style.creative
   *   precise  : conversation_style.precise
   */
  console.log(await a.ask(prompt, conversation_style.balanced));
}

test("Your-prompt");

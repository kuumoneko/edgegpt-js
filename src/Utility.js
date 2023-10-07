const crypto = require("node:crypto");
const conversation_style = {
  precise: "h3precise",
  balanced: "galileo",
  creative: "h3imaginative",
};

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.41";

const DELIMITER = "\x1e";

const headers = getHeaders();

/**
 * Generates random IP
 * @returns {string}
 */
function generateRandomIP() {
  return `13.${Math.floor(Math.random() * 104) + 104}.${Array.from(Array(2))
    .map(() => Math.floor(Math.random() * 255))
    .join(".")}`;
}

function genRanHex(size) {
  return [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
}

/**
 * gets headers for request
 * @returns Object
 */
function getHeaders(COOKIE_U) {
  return {
    accept: "application/json",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-ch-ua":
      '"Microsoft Edge";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
    "sec-ch-ua-arch": '"x86"',
    "sec-ch-ua-bitness": '"64"',
    "sec-ch-ua-full-version": '"113.0.1774.50"',
    "sec-ch-ua-full-version-list":
      '"Microsoft Edge";v="113.0.1774.50", "Chromium";v="113.0.5672.127", "Not-A.Brand";v="24.0.0.0"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-model": '""',
    "sec-ch-ua-platform": '"Windows"',
    "sec-ch-ua-platform-version": '"15.0.0"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-ms-gec": genRanHex(64).toUpperCase(),
    "sec-ms-gec-version": "1-115.0.1866.1",
    "x-ms-client-request-id": crypto.randomUUID(),
    "x-ms-useragent":
      "azsdk-js-api-client-factory/1.0.0-beta.1 core-rest-pipeline/1.10.0 OS/Win32",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.50",
    cookie: `_U=${COOKIE_U}`,
    Referer: "https://www.bing.com/search?q=Bing+AI&showconv=1",
    "Referrer-Policy": "origin-when-cross-origin",
    // Workaround for request being blocked due to geolocation
    // 'x-forwarded-for': '1.1.1.1', // 1.1.1.1 seems to no longer work.
    // ...(this.options.xForwardedFor
    //   ? { "x-forwarded-for": this.options.xForwardedFor }
    //   : {}),
  };
}

/**
 * Creates a chat request
 * @param conversation
 * @param mode
 * @returns {function(*): {arguments: [{optionsSets, conversationId: *, source: string, conversationSignature: *, message: {messageType: string, author: string, inputMethod: string, text: *}, isStartOfSession: boolean, participant: {id: *}}], type: number, invocationId: string, target: string}}
 */
function createChatRequest(
  conversation,
  prompt,
  mode = conversation_style.balanced
) {
  let encryptedConversationSignature = conversation.conversationSignature;
  let invocationId = 0;
  return {
    arguments: [
      {
        source: "cib",
        optionsSets: [
          mode,
          "nlu_direct_response_filter",
          "deepleo",
          "disable_emoji_spoken_text",
          "responsible_ai_policy_235",
          "enablemm",
          "dtappid",
          "trn8req120",
          "h3ads",
          "rai251",
          "blocklistv2",
          "localtime",
          "dv3sugg",
        ],
        isStartOfSession: invocationId++ === 0,
        message: {
          author: "user",
          inputMethod: "Keyboard",
          text: prompt,
          messageType: "Chat",
        },
        encryptedConversationSignature,
        participant: {
          id: conversation.clientId,
        },
        conversationId: conversation.conversationId,
      },
    ],
    invocationId: String(invocationId),
    target: "chat",
    type: 4,
  };
}

module.exports = {
  conversation_style,
  headers,
  createChatRequest,
  DELIMITER,
  getHeaders,
};

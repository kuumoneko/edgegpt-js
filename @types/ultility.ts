
export const conversation_style = {
    precise: "h3precise",
    balanced: "galileo",
    creative: "h3imaginative",
};

type ResponseAdaptiveCardBody = {
    text: string,
    type: "TextBlock",
    wrap: boolean
}

type ResponseAdaptiveCard = {
    type: "AdaptiveCard",
    version: string,
    body: ResponseAdaptiveCardBody[]
}

type ResponseScore = {
    omponent: string,
    score: number
}

type ResponseSource = {

    imageFavicon: string | undefined,
    imageHeight: string | undefined,
    imageWidth: string | undefined,
    imageLink: string | undefined,
    mediaUniqueId: string | undefined,
    provider: string | undefined,
    providerDisplayName: string | undefined,
    searchQuery: string | undefined,
    seeMoreUrl: string | undefined,
    sourceType: string | undefined,
}

export type Response = {
    adaptiveCards: ResponseAdaptiveCard[],
    author: string,
    contentOrigin: string,
    createdAt: string,
    feedback: { tag: null | string, updateOn: string | null, type: string },
    messageId: string,
    offense: string,
    requestId: string,
    scores: ResponseScore[],
    sourceAttributions: ResponseSource[],
    text: string,
    timestamp: string,
}

export type ChatRequest = {
    arguments: [
        {
            optionsSets: string[],
            conversationId: string,
            source: string,
            // conversationSignature: string,
            message:
            {
                messageType: string,
                author: string,
                inputMethod: string,
                text: string
            },
            encryptedConversationSignature: string,
            // encryptedConversationSignature: string,
            isStartOfSession: boolean,
            participant:
            {
                id: string
            }
        }],
    type: number,
    invocationId: string,
    target: string
}

export type Header = {
    accept: string,
    "accept-language": string,
    "content-type": string,
    "sec-ch-ua": string,
    "sec-ch-ua-arch": string,
    "sec-ch-ua-bitness": string,
    "sec-ch-ua-full-version": string,
    "sec-ch-ua-full-version-list": string,
    "sec-ch-ua-mobile": string,
    "sec-ch-ua-model": string,
    "sec-ch-ua-platform": string,
    "sec-ch-ua-platform-version": string,
    "sec-fetch-dest": string,
    "sec-fetch-mode": string,
    "sec-fetch-site": string,
    "sec-ms-gec": string,
    "sec-ms-gec-version": string,
    "x-ms-client-request-id": string,
    "x-ms-useragent": string,
    "user-agent": string,
    cookie: string,
    origin: string,
    Referer: string,
    "Referrer-Policy": string
}

export const DELIMITER = "\x1e";

/**
 * 
 * @returns string
 */
function genRanHex(size: number) {
    return [...Array(size)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");
}

export function getHeaders(cookie: string = "", referrer: string = ""): Header {
    var accp: string = "";
    var content_tp: string = "";

    if (referrer == "https://www.bing.com/search?q=Bing+AI&showconv=1") {
        accp = "application/json";
        content_tp = "application/json"
    }
    else if (referrer == "https://www.bing.com/images/create/") {
        accp = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7";
        content_tp = "application/x-www-form-urlencoded"
    }

    return {
        accept: accp,
        "accept-language": "en-US,en;q=0.9",
        "content-type": content_tp,
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
        cookie: `SUID=A; _U=${cookie}`,
        origin: "https://www.bing.com",
        Referer: referrer,
        "Referrer-Policy": "origin-when-cross-origin",
    };
}

export function createChatRequest(
    conversation: {
        conversationSignature: string,
        clientId: string,
        conversationId: string
    },
    prompt: string,
    mode: string = conversation_style.balanced,
    turn: number
): ChatRequest {
    let encryptedConversationSignature = conversation.conversationSignature;
    let invocationId = turn;
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
                encryptedConversationSignature: encryptedConversationSignature,
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

export async function importESmodule() {
    return (await import("node-fetch")).default;
}
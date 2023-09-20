const conversation_style = {
    precise: 'h3precise',
    balanced: 'galileo',
    creative: 'h3relaxedimg',
}

const USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.41'

const DELIMITER = '\x1e'

const headers = getHeaders();

/**
 * Generates random IP
 * @returns {string}
 */
function generateRandomIP() {
    return `13.${Math.floor(Math.random() * 104) + 104}.${Array.from(Array(2))
        .map(() => Math.floor(Math.random() * 255))
        .join('.')}`
}

/**
 * gets headers for request
 * @returns Object
 */
function getHeaders(COOKIE_U) {
    return {
        'user-agent': USER_AGENT,
        Origin: 'https://www.bing.com',
        Referer: 'https://www.bing.com/',
        'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Microsoft Edge";v="110"',
        'sec-ch-ua-platform': 'Windows',
        'x-forwarded-for': generateRandomIP(),
        Cookie: `_U=${COOKIE_U}`,
    }
}

/**
 * Creates a chat request
 * @param conversation
 * @param mode
 * @returns {function(*): {arguments: [{optionsSets, conversationId: *, source: string, conversationSignature: *, message: {messageType: string, author: string, inputMethod: string, text: *}, isStartOfSession: boolean, participant: {id: *}}], type: number, invocationId: string, target: string}}
 */
function createChatRequest(conversation, prompt, mode = conversation_style.balanced) {
    let invocationId = 0
    return {
        arguments: [
            {
                source: 'cib',
                optionsSets: [
                    mode,
                    'nlu_direct_response_filter',
                    'deepleo',
                    'disable_emoji_spoken_text',
                    'responsible_ai_policy_235',
                    'enablemm',
                    'dtappid',
                    'trn8req120',
                    'h3ads',
                    'rai251',
                    'blocklistv2',
                    'localtime',
                    'dv3sugg',
                ],
                isStartOfSession: invocationId++ === 0,
                message: {
                    author: 'user',
                    inputMethod: 'Keyboard',
                    text: prompt,
                    messageType: 'Chat',
                },
                conversationSignature: conversation.conversationSignature,
                participant: {
                    id: conversation.clientId,
                },
                conversationId: conversation.conversationId,
            },
        ],
        invocationId: String(invocationId),
        target: 'chat',
        type: 4,
    }
}


module.exports = {
    conversation_style, headers, createChatRequest, DELIMITER, getHeaders
}
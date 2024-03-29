// @ts-nocheck
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importESmodule = exports.createChatRequest = exports.getHeaders = exports.DELIMITER = exports.conversation_style = void 0;
const crypto_1 = __importDefault(require("crypto"));
exports.conversation_style = {
    precise: "h3precise",
    balanced: "galileo",
    creative: "h3imaginative",
};
exports.DELIMITER = "\x1e";
function genRanHex(size) {
    return [...Array(size)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");
}
function getHeaders(cookie = "", referrer = "") {
    let accp = "";
    let content_tp = "";
    if (referrer == "https://www.bing.com/search?q=Bing+AI&showconv=1") {
        accp = "application/json";
        content_tp = "application/json";
    }
    else if (referrer == "https://www.bing.com/images/create/") {
        accp = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7";
        content_tp = "application/x-www-form-urlencoded";
    }
    return {
        accept: accp,
        "accept-language": "en-US,en;q=0.9",
        "content-type": content_tp,
        "sec-ch-ua": '"Microsoft Edge";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
        "sec-ch-ua-arch": '"x86"',
        "sec-ch-ua-bitness": '"64"',
        "sec-ch-ua-full-version": '"113.0.1774.50"',
        "sec-ch-ua-full-version-list": '"Microsoft Edge";v="113.0.1774.50", "Chromium";v="113.0.5672.127", "Not-A.Brand";v="24.0.0.0"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-model": '""',
        "sec-ch-ua-platform": '"Windows"',
        "sec-ch-ua-platform-version": '"15.0.0"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-ms-gec": genRanHex(64).toUpperCase(),
        "sec-ms-gec-version": "1-115.0.1866.1",
        "x-ms-client-request-id": crypto_1.default.randomUUID(),
        "x-ms-useragent": "azsdk-js-api-client-factory/1.0.0-beta.1 core-rest-pipeline/1.10.0 OS/Win32",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.50",
        cookie: `SUID=A; _U=${cookie}`,
        origin: "https://www.bing.com",
        Referer: referrer,
        "Referrer-Policy": "origin-when-cross-origin",
    };
}
exports.getHeaders = getHeaders;
function createChatRequest(conversation, prompt, mode = exports.conversation_style.balanced, turn) {
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
exports.createChatRequest = createChatRequest;
async function importESmodule() {
    return (await import("node-fetch")).default;
        }
        exports.importESmodule = importESmodule;
//# sourceMappingURL=ultility.cjs.map
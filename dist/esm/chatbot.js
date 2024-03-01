// @ts-nocheck
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { conversation_style, getHeaders, importESmodule } from "./ultility.js";
import { ChatHub } from "./chathub.js";
import { Agent } from "undici";
export class ChatBot {
    constructor(cookie_U) {
        this.headers = getHeaders(cookie_U, "https://www.bing.com/search?q=Bing+AI&showconv=1");
    }
    ready() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.chatHub.init();
        });
    }
    init(conversation = { conversationSignature: "", clientId: "", conversationId: "", turn: undefined }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (conversation.turn == undefined) {
                this.headers = Object.fromEntries(Object.entries(this.headers).filter(([, value]) => value !== undefined));
                const fetchOptions = {
                    headers: this.headers,
                };
                fetchOptions.dispatcher = new Agent({ connect: { timeout: 20000 } });
                const res = yield (yield importESmodule())(`https://www.bing.com/turing/conversation/create`, fetchOptions);
                conversation = JSON.parse(yield res.text());
                conversation.conversationSignature = res.headers.get("x-sydney-encryptedconversationsignature") || "";
            }
            this.chatHub = new ChatHub(conversation);
            return conversation;
        });
    }
    ask(prompt, mode = conversation_style.balanced, turn) {
        return __awaiter(this, void 0, void 0, function* () {
            this.mode = mode;
            return new Promise((resolve) => {
                try {
                    this.chatHub.once("final", (item) => {
                        resolve(item.item.messages[item.item.messages.length - 1]);
                    });
                }
                catch (_a) { }
                this.chatHub.ask(prompt, mode, turn).then();
            });
        });
    }
    close() {
        try {
            this.chatHub.close();
        }
        catch (_a) { }
    }
    reset() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init();
        });
    }
}
//# sourceMappingURL=chatbot.js.map
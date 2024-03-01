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
import { EventEmitter } from "events";
import { WebSocket } from "ws";
import { createChatRequest, DELIMITER, getHeaders, conversation_style, } from "./ultility.js";
export class ChatHub extends EventEmitter {
    constructor(conversation) {
        super();
        this.conversation = conversation;
        this.headers = getHeaders();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                this.socket = new WebSocket(`wss://sydney.bing.com/sydney/ChatHub?sec_access_token=${encodeURIComponent(this.conversation.conversationSignature)}`, {
                    headers: this.headers,
                });
                this.socket.addEventListener("open", () => {
                    this.send({ protocol: "json", version: 1 });
                    resolve(this.socket);
                });
                this.socket.addEventListener("message", (item) => {
                    const items = item.data.toString().split(DELIMITER);
                    for (const item of items) {
                        if (!item)
                            continue;
                        const response = JSON.parse(item);
                        if ((response === null || response === void 0 ? void 0 : response.type) === 1) {
                            try {
                                const { text } = response.arguments[0].messages[0].adaptiveCards[0].body.pop();
                                this.emit("message", text);
                            }
                            catch (_a) { }
                        }
                        else if ((response === null || response === void 0 ? void 0 : response.type) === 2) {
                            this.emit("final", response);
                        }
                    }
                });
                this.socket.addEventListener("close", (...args) => this.emit("close", ...args));
                this.socket.addEventListener("error", (...args) => this.emit("error", ...args));
            });
        });
    }
    ask(prompt, mode = conversation_style.balanced, turn) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.socket || this.socket.readyState === WebSocket.CLOSED)
                yield this.init();
            var c = this.create(this.conversation, prompt, mode, turn);
            this.send(c);
        });
    }
    create(conversation, prompt, mode, turn) {
        return createChatRequest(conversation, prompt, mode, turn);
    }
    send(msg) {
        this.socket.send(JSON.stringify(msg) + DELIMITER);
    }
    close() {
        if (this.socket)
            this.socket.close();
    }
}
//# sourceMappingURL=chathub.js.map
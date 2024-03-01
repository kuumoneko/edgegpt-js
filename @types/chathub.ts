import { EventEmitter } from "events";
import { WebSocket } from "ws";
import {
    createChatRequest,
    DELIMITER,
    getHeaders,
    conversation_style,
    ChatRequest,
    Header,
} from "./ultility.js";

export class ChatHub extends EventEmitter {
    conversation: {
        conversationSignature: string,
        clientId: string,
        conversationId: string,
        turn: number
    };
    headers: Header;
    socket: any;
    constructor(conversation: { conversationSignature: string, clientId: string, conversationId: string, turn: number }) {
        super();
        this.conversation = conversation;
        this.headers = getHeaders();
    }

    async init(): Promise<void> {
        return new Promise((resolve) => {
            this.socket = new WebSocket(
                `wss://sydney.bing.com/sydney/ChatHub?sec_access_token=${encodeURIComponent(
                    this.conversation.conversationSignature
                )}`,
                {
                    headers: this.headers,
                }
            );

            this.socket.addEventListener("open", () => {
                this.send({ protocol: "json", version: 1 });
                resolve(this.socket);
            });

            this.socket.addEventListener("message", (item: any) => {
                const items = item.data.toString().split(DELIMITER);
                for (const item of items) {
                    if (!item) continue;

                    const response = JSON.parse(item);
                    if (response?.type === 1) {
                        try {
                            // noinspection JSUnresolvedReference
                            const { text } =
                                response.arguments[0].messages[0].adaptiveCards[0].body.pop();
                            this.emit("message", text);
                        } catch { }
                    } else if (response?.type === 2) {
                        this.emit("final", response);
                    }
                }
            });
            this.socket.addEventListener("close", (...args: any) =>
                this.emit("close", ...args)
            );
            this.socket.addEventListener("error", (...args: any) =>
                this.emit("error", ...args)
            );
        });
    }

    async ask(prompt: string, mode = conversation_style.balanced, turn: number): Promise<void> {
        if (!this.socket || this.socket.readyState === WebSocket.CLOSED)
            await this.init();
        var c = this.create(this.conversation, prompt, mode, turn);
        this.send(c);
    }

    create(conversation: any, prompt: string, mode: string, turn: number): ChatRequest {
        return createChatRequest(conversation, prompt, mode, turn);
    }

    /**
     * Sends a message
     * @param msg
     */
    send(msg: any): void {
        this.socket.send(JSON.stringify(msg) + DELIMITER);
    }

    /**
     * Closes the WebSocket connection
     */
    close(): void {
        if (this.socket) this.socket.close();
    }
}

import { Response, conversation_style, getHeaders, importESmodule } from "./ultility.js";
import { ChatHub } from "./chathub.js";
import fetch from "node-fetch"

import { Agent } from "undici";

export class ChatBot {
    chatHub: ChatHub | any;
    headers: { accept: string; "accept-language": string; "content-type": string; "sec-ch-ua": string; "sec-ch-ua-arch": string; "sec-ch-ua-bitness": string; "sec-ch-ua-full-version": string; "sec-ch-ua-full-version-list": string; "sec-ch-ua-mobile": string; "sec-ch-ua-model": string; "sec-ch-ua-platform": string; "sec-ch-ua-platform-version": string; "sec-fetch-dest": string; "sec-fetch-mode": string; "sec-fetch-site": string; "sec-ms-gec": string; "sec-ms-gec-version": string; "x-ms-client-request-id": `${string}-${string}-${string}-${string}-${string}`; "x-ms-useragent": string; "user-agent": string; cookie: string; Referer: string; "Referrer-Policy": string; } | any;
    mode: string | any;

    constructor(cookie_U: string) {
        this.headers = getHeaders(cookie_U, "https://www.bing.com/search?q=Bing+AI&showconv=1");
    }

    async ready(): Promise<void> {
        await this.chatHub.init();
    }

    async init(conversation: { conversationSignature: string, clientId: string, conversationId: string, turn: any } = { conversationSignature: "", clientId: "", conversationId: "", turn: undefined }
    ): Promise<{ conversationSignature: string, clientId: string, conversationId: string, turn: number }> {
        if (conversation.turn == undefined) {
            this.headers = Object.fromEntries(
                Object.entries(this.headers).filter(([, value]) => value !== undefined)
            );

            const fetchOptions: any = {
                headers: this.headers,
            };

            fetchOptions.dispatcher = new Agent({ connect: { timeout: 20_000 } });

            const res = await (await importESmodule())(
                `https://www.bing.com/turing/conversation/create`,
                fetchOptions
            );

            conversation = JSON.parse(await res.text());
            conversation.conversationSignature = res.headers.get(
                "x-sydney-encryptedconversationsignature"
            ) || "";
        }
        this.chatHub = new ChatHub(conversation);
        return conversation;
    }

    async ask(prompt: string, mode = conversation_style.balanced, turn: number): Promise<Response> {
        this.mode = mode;
        return new Promise((resolve) => {
            try {
                this.chatHub.once("final", (item: any) => {
                    resolve(item.item.messages[item.item.messages.length - 1]);
                });
            }
            catch { }
            this.chatHub.ask(prompt, mode, turn).then();
        });
    }

    close(): void {
        try {
            this.chatHub.close();
        }
        catch { }
    }

    async reset(): Promise<void> {
        await this.init();
    }
}

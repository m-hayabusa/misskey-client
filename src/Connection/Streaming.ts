import { Api } from "./API";
import websocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '../Interfaces/input';

export class StreamingBody {
    public channel: string
    public id: string;
    public params: any;
    constructor(channel: string, id?: string, params?: any) {
        this.id = (id === undefined ? uuidv4() : id);
        this.channel = channel;
        this.params = params;
    }
}

export default class Streaming {
    static ws: websocket;
    static hook: Map<string, (param: string) => void> = new Map<string, (param: string) => void>();

    static isReady = false;

    constructor(forceReconnect = false) {
        if (Streaming.isReady && forceReconnect) {
            Streaming.isReady = false;
            Streaming.ws.close();
            Streaming.hook.clear();
        }
        if (!Streaming.isReady) {
            Streaming.ws = new websocket("wss://" + Api.accounts.get(Api.account)?.getUri() + "/streaming?i=" + Api.accounts.get(Api.account)?.getKey());
            Streaming.ws.on('open', () => {
                Streaming.isReady = true;
                process.stdout.write("\x1b[1A" + "\x1b[2K");
                console.log("connected");
                this.connectChannel("main");
                Input.prompt(true);
            });
            Streaming.ws.on("message", (str: any) => {
                try {
                    const data = JSON.parse(str);
                    const hook = Streaming.hook.get(data.body.id);
                    if (hook != null) {
                        hook(data.body);
                    }
                } catch (e) {
                    console.warn("ぶええええ\n", e, "\n\n");
                }
            });
            Streaming.ws.on('error', (err) => {
                console.warn(err);
                Streaming.isReady = false;
            });
        }
    }

    static Id: Map<string, string> = new Map<string, string>();
    static notes: Map<string, string> = new Map<string, string>();

    public connectChannel(arg: string): string {
        if (!Streaming.isReady) { return "not_connected"; }

        const body = new StreamingBody(arg);
        Streaming.ws.send(JSON.stringify({ "type": "connect", "body": body }));
        Streaming.hook.set(body.id, (data: any) => {
            if (data.type === "note") {
                process.stdout.write("\x1b[2K");

                if (data.body.renote) {
                    console.log("\x1b[G" + "\x1b[46m " + data.body.user.name + " \x1b[43m Re "
                        + "\x1b[42m " + data.body.renote.user.name + " \x1b[0m");
                } else {
                    console.log("\x1b[G" + "\x1b[46m " + data.body.user.name + " \x1b[0m");
                }

                console.log(data.body.text ? data.body.text : '\x1b[2m (本文なし) \x1b[0m');

                if (data.body.renote) {
                    process.stdout.write('-'.repeat(process.stdout.columns) + " \x1b[0m");

                    console.log("\x1b[G" + data.body.renote.text + " \x1b[0m");
                }

                let id = data.body.user.username + (data.body.user.host ? ('@' + data.body.user.host) : '');
                if (data.body.renote) {
                    id += ' Re ' + data.body.renote.user.username + '@' + data.body.renote.user.host;
                }
                Streaming.notes.set(data.body.id.slice(-4), data.body.id);
                console.log("\x1b[G\x1b[47m\x1b[30m " + data.body.id.slice(-4) + ' ' + id + ' '.repeat(process.stdout.columns - data.body.createdAt.length - id.toString().length - 2 - 5) + data.body.createdAt + " \x1b[0m");

                Input.prompt(true);
            } else if (data.type === "notification" && data.body.isRead === false) {
                if (data.body.type === "reaction") {
                    Streaming.notes.set(data.body.note.id.slice(-4), data.body.note.id);

                    console.log("\x1b[G\x1b[2Kreaction", `${data.body.user.name} ${data.body.user.username}${data.body.user.host ? '@' + data.body.user.host : ''}` ,data.body.reaction, data.body.note.id.slice(-4), data.body.note.text);
                } else if (data.body.type === "renote" || data.body.type === "quote") {
                    Streaming.notes.set(data.body.note.id.slice(-4), data.body.note.id);
                    Streaming.notes.set(data.body.note.renote.id.slice(-4), data.body.note.renote.id);

                    console.log("\x1b[G\x1b[2Krenote", data.body.note.renote.id.slice(-4), data.body.note.id.slice(-4), data.body.note.renote.text, data.body.note.text);
                } else if (data.body.type === "reply" || data.body.type === "mention") {
                    Streaming.notes.set(data.body.note.id.slice(-4), data.body.note.id);
                    Streaming.notes.set(data.body.note.reply.id.slice(-4), data.body.note.reply.id);

                    console.log("\x1b[G\x1b[2Kreply", data.body.note.reply.id.slice(-4), data.body.note.id.slice(-4), data.body.note.reply.text, data.body.note.text);
                } else if (data.body.type === "receiveFollowRequest") {
                    console.log("\x1b[G\x1b[2KreceiveFollowRequest", data.body.user.username);
                } else if (data.body.type === "follow") {
                    console.log("\x1b[G\x1b[2Kfollow", data.body.user.username);
                } else {
                    console.log("\x1b[G\x1b[2Knotify", JSON.stringify(data));
                }
                Input.prompt(true);
            }
        });
        Streaming.Id.set(arg, body.id);
        return body.id;
    }

    public disconnectChannel(arg: string): boolean {
        const id = Streaming.Id.get(arg);
        if (id) {
            const body = new StreamingBody("connect", id);
            Streaming.ws.send(JSON.stringify({ "type": "disconnect", "body": body }));
            Streaming.hook.delete(id);
        } else {
            return false;
        }

        return true;
    }
}
import command from "./command";
import Streaming from "../Connection/Streaming";
import { StreamingBody as StreamingBody } from "../Connection/Streaming";
import { input } from '../main';

export default class connectStream extends command {
    regex = /^(connect)$/;
    help = "connectStream :\t> connect <main|homeTimeline>\t-> タイムラインにストリーミング接続します (開発中)";
    function = function (arg: string): string {
        const stream = new Streaming();

        connectStream.Id.set(arg, stream.connectChannel(new StreamingBody(arg), (data: any) => {
            // console.log(data);
            if (data.type === "note") {
                // input.prompt(false);
                process.stdout.write("\x1b[1A" + "\x1b[2K");

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
                connectStream.notes.set(data.body.id.slice(-4), data.body.id);
                console.log("\x1b[G\x1b[47m\x1b[30m " + data.body.id.slice(-4) + ' ' + id + ' '.repeat(process.stdout.columns - data.body.createdAt.length - id.toString().length - 2 - 5) + data.body.createdAt + " \x1b[0m");

                input.prompt(true);
            } else if (data.type === "notification" && data.body.isRead === false) {
                if (data.body.type === "reaction") {
                    console.log("reaction", data.body.reaction, data.body.note.id.slice(-4), data.body.note.text); //TODO:ぶえ
                } else if (data.body.type === "renote" || data.body.type === "quote") {
                    console.log("renote", data.body.renote.id.slice(-4), data.body.note.id.slice(-4), data.body.renote.text, data.body.note.text);
                } else if (data.body.type === "reply") {
                    console.log(JSON.stringify(data));
                } else {
                    console.log(JSON.stringify(data));
                }
            } else if (data.type === "readAllNotifications" || data.type === "unreadNotification" || data.type === "renote") {
                // do nothing
            } else {
                console.log(JSON.stringify(data));
            }
        }));

        return "connectStream: " + arg;
    };
    static Id: Map<string, string> = new Map<string, string>();
    static notes: Map<string, string> = new Map<string, string>();
}


export class disconnectStream extends command {
    regex = /^(disconnect)/;
    help = "disconnectStream :\t> connect <homeTimeline>\t-> タイムラインにストリーミング接続します (開発中)";
    function = function (arg: string): string {
        const stream = new Streaming();
        const id = connectStream.Id.get(arg);
        if (id) {
            stream.disconnectChannel(id);
        } else {
            return (new disconnectStream).help;
        }

        return "disconnectStream: " + arg;
    }
}
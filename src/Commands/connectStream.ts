import command from "./command";
import Streaming from "../Connection/Streaming";

export default class connectStream extends command {
    regex = /^(connect)$/;
    help = "connectStream :\t> connect <main|homeTimeline>\t-> タイムラインにストリーミング接続します (開発中)";
    function = function (arg: string): string {
        const stream = new Streaming();
        stream.connectChannel(arg);

        return "connectStream: " + arg;
    };
}


export class disconnectStream extends command {
    regex = /^(disconnect)/;
    help = "disconnectStream :\t> connect <homeTimeline>\t-> タイムラインにストリーミング接続します (開発中)";
    function = function (arg: string): string {
        const stream = new Streaming();
        stream.disconnectChannel(arg);

        return "disconnectStream: " + arg;
    }
}
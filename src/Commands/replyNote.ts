import command from "./command";
import { Api } from "../Connection/API";
import Streaming from "../Connection/Streaming";

export default class replyNote extends command {
    regex = /^(reply|re)$/
    help = "replyNote:\t> re <投稿ID> <コメント>\t-> 投稿にリプライします"
    function = function (arg: string): string {
        const t = / ?(.{4})(?: (.*))?/.exec(arg);
        if (!t) {
            return (new replyNote).help;
        }
        const text = t[2];
        const replyId = Streaming.notes.get(t[1]);
        if (replyId == undefined || text == undefined || /^[ ]*$/.test(text)) {
            return (new replyNote).help;
        }
        Api.request("notes/create", { "text": text, 'visibility': 'public', 'replyId': replyId });
        return "replyNote: " + arg;
    };
}
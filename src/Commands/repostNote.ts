import command from "./command";
import API from "../Connection/API";
import connectStream from "./connectStream";

export default class repostNote extends command {
    regex = /^(renote|rp)/
    help = "repostNote:\t> rp <投稿ID> <?:コメント>\t-> 投稿をリポストします"
    function = function (arg: string): string {
        const t = / ?(.{4})(?: (.*))?/.exec(arg);
        if (!t) {
            return (new repostNote).help;
        }
        const text = t[2];
        const renoteId = connectStream.notes.get(t[1]);
        if (!renoteId) {
            return (new repostNote).help;
        }
        const api = new API();
        api.request("notes/create", { "text": text, 'visibility': 'public', 'renoteId': renoteId });
        return "repostNote: " + arg;
    };
}
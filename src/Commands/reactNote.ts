import command from "./command";
import API from "../Connection/API";
import connectStream from "./connectStream";

export default class reactNote extends command {
    regex = /^(fav)$/
    help = "reactNote:\t> fav <投稿ID> <絵文字>\t-> 投稿にリアクションします"
    function = function (arg: string): string {
        const t = / ?(.{4})(?: (.*))?/.exec(arg);
        if (!t) {
            return (new reactNote).help;
        }
        const text = t[2] ? t[2] : "🍮";
        const noteId = connectStream.notes.get(t[1]);
        if (!noteId) {
            return (new reactNote).help;
        }
        const api = new API();
        api.request("notes/reactions/create", { 'noteId': noteId, 'reaction': text });
        return "reactNote: " + arg;
    };
}
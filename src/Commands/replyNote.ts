import command from "./command"
import API from "../Connection/API"
import connectStream from "./connectStream"

export default class replyNote extends command {
    regex = /^(reply|re)/
    help = "replyNote:\t> re <投稿ID> <コメント>\t-> 投稿にリプライします"
    function = function(arg:string){
        const t = / ?(.{4})(?: (.*))?/.exec(arg)
        if (!t) {
            return (new replyNote).help;
        }
        const text = t[2]
        const replyId = connectStream.notes.get(t[1])
        if (!replyId) {
            return (new replyNote).help;
        }
        let api = new API();
        api.request("notes/create", {"text": text, 'visibility':'public', 'replyId':replyId});
        return "replyNote: " + arg;
    };
}
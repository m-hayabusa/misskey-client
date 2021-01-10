import command from "./command";
import { Api } from "../Connection/API";

export default class createNote extends command {
    regex = /^(note|n)$/;
    help = "createNote:\t> note <投稿内容>\t-> 入力された文章が投稿されます";
    function = function (arg: string): string {
        if (!arg) {
            return (new createNote).help;
        }
        Api.request("notes/create", { "text": arg, 'visibility': 'public' });
        return "createNote: " + arg;
    };
}

import command from "./command";
import API from "../Connection/API";
import Streaming from "../Connection/Streaming";

export default class selectAccount extends command {
    regex = /^(switch)$/;
    help = "selectAccount:\t> switch <ユーザーID>\t-> そのアカウントに切り替えます";
    function = function (arg: string): string {
        if (!arg || !API.accounts.has(arg)) {
            return (new selectAccount).help;
        }
        API.account = arg;
        new Streaming();

        return "selectAccount: " + arg;
    };
}
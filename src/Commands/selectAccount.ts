import command from "./command";
import { Api } from "../Connection/API";
import Streaming from "../Connection/Streaming";

export default class selectAccount extends command {
    regex = /^(switch)$/;
    help = "selectAccount:\t> switch <ユーザーID>\t-> そのアカウントに切り替えます";
    function = function (arg: string): string {
        if (!arg || !Api.accounts.has(arg)) {
            return (new selectAccount).help;
        }
        Api.account = arg;
        new Streaming();

        return "selectAccount: " + arg;
    };
}
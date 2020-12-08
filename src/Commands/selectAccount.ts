import command from "./command";
import API from "../Connection/API"
import {misskeyCredential} from "../Connection/API" 

export default class selectAccount extends command {
    regex = /^(switch)/;
    help = "selectAccount:\t> switch <ユーザーID>\t-> そのアカウントに切り替えます";
    function = function(arg:string){
        if (!arg || !API.accounts.has(arg)) {
            return (new selectAccount).help;
        }
        API.account = arg;

        return "selectAccount: " + arg;
    };
}
import command from "./command";
import API from "../Connection/API"
import {input} from '../main';
import {v4 as uuidv4} from 'uuid'
import {misskeyCredential} from "../Connection/API" 
import Config from '../Interfaces/config';

export default class addAccount extends command {
    regex = /^(addAccount)/;
    help = "addAccount:\t> addAccount <ユーザーID>\t-> そのアカウントでログインします";
    function = function(arg:string){
        let api = new API;
        const args = arg.split("@");
        console.log(args);

        if (!args[1] || API.accounts.has(arg)) {
            return (new addAccount).help;
        }
        
        const sessionID = uuidv4();
        const perms = ["read:account", "write:account", "read:blocks", "write:blocks", "read:drive", "write:drive", "read:favorites", "write:favorites", "read:following", "write:following", "read:messaging", "write:messaging", "read:mutes", "write:mutes", "write:notes", "read:notifications", "write:notifications", "read:reactions", "write:reactions", "write:votes", "read:pages", "read:user-groups", "write:user-groups", "read:channels", "write:channels"];
        const name = "MisskeyTerm";

        console.log("https://" + args[1] + "/miauth/" + sessionID + "?name=" + name + "&permission=" + perms);
        input.question("Webブラウザに移動して、やっていったらEnter", ()=>{
            api.request("miauth/"+sessionID+"/check", {}, (ret:any)=>{
                if(ret.ok){
                    console.log("取得しました");
                    API.accounts.set(arg, new misskeyCredential(args[1], ret.token));
                    API.account = arg;
                    const config = new Config;
                    config.saveCredentials();
                } else {
                    console.log("取得できませんでした");
                }
            }, false, args[1]);
        });
        
        return '';
    };
}
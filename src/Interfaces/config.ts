import API from "../Connection/API"
import {misskeyCredential} from "../Connection/API";

export default class config {
    public saveCredentials(){
        // console.log("saveCredentials");
        const fs = require('fs');
        if (!fs.existsSync("./.config")) { fs.mkdirSync("./.config"); }
        fs.writeFileSync('./.config/credentials.json', JSON.stringify(Array.from(API.accounts.entries())));
    }
    
    public loadCredentials(){
        // console.log("loadCredentials");
        const fs = require('fs');
        try {
            // console.log("try");
            const json:string = fs.readFileSync('./.config/credentials.json');
            API.accounts = new Map<string, misskeyCredential>();
            JSON.parse(json).forEach((element:any) => {
                // console.log(element,element[0],element[1].domain, element[1].key);
                API.accounts.set(element[0], new misskeyCredential(element[1].domain, element[1].key));
            });
        } catch(e) {
            console.log("設定ファイルが存在しないか、壊れています");
            API.accounts = new Map<string, misskeyCredential>();
            this.saveCredentials();
        }
    }
}
import API from "../Connection/API";
import { misskeyCredential } from "../Connection/API";
import fs from 'fs';

export default class config {
    public saveCredentials(): boolean {
        try {
            if (!fs.existsSync("./.config")) { fs.mkdirSync("./.config"); }
            fs.writeFileSync('./.config/credentials.json', JSON.stringify(Array.from(API.accounts.entries())));
            return true;
        } catch (e) {
            console.warn("config.saveCredentials:", e);
            return false;
        }
    }

    public loadCredentials(): boolean {
        try {
            // console.log("try");
            const json: string = fs.readFileSync('./.config/credentials.json').toString();
            API.accounts = new Map<string, misskeyCredential>();
            JSON.parse(json).forEach((element: any) => {
                // console.log(element,element[0],element[1].domain, element[1].key);
                API.accounts.set(element[0], new misskeyCredential(element[1].domain, element[1].key));
            });
            return true;
        } catch (e) {
            console.warn("config.loadCredentials:", e);
            console.log("設定ファイルが存在しないか、壊れています");
            API.accounts = new Map<string, misskeyCredential>();
            this.saveCredentials();
            return false;
        }
    }
}
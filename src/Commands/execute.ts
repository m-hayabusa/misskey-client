import command from "./command";
import { Api } from "../Connection/API";

export default class execute extends command {
    regex = /^(f)$/;
    help = "execute:\t> f <arg>\t-> eval(arg) // request() で当該ユーザーの権限でMisskey APIにアクセス可能";
    function = function (arg: string): string {
        if (!arg) {
            return (new execute).help;
        }
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const request = function (endpoint: string, reqbody?: any, callback?: (param: string) => void, auth = true, host?: string): void {
                if (!reqbody) reqbody = {};
                if (!callback) callback = function (data: string) { console.log(data); };

                Api.request(endpoint, reqbody, callback, auth, host);
            };

            return "execute: " + eval(arg);
        } catch (e) {
            return "execute: Error: " + e;
        }
    };
}

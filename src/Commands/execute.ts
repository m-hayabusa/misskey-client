import command from "./command";
import API from "../Connection/API";

export default class execute extends command {
    regex = /^(f)/;
    help = "execute:\t> f <arg>\t-> eval(arg) // api.request() で当該ユーザーの権限でMisskey APIにアクセス可能";
    function = function (arg: string): string {
        if (!arg) {
            return (new execute).help;
        }
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const api = new API(); //eval内からapiにアクセスできるようにするため
            return "execute: " + eval(arg);
        } catch (e) {
            return "execute: " + e;
        }
    };
}

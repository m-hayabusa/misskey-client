import command from "./command";
import API from "../Connection/API"

export default class execute extends command {
    regex = /^(f)/;
    help = "execute:\t> f <arg>\t-> eval(arg) // api.request() で当該ユーザーの権限でMisskey APIにアクセス可能";
    function = function(arg:string){
        if (!arg) {
            return (new execute).help;
        }
        try {
            let api = new API();
            return "execute: " + eval(arg);
        } catch (e) {
            return "execute: " + e;
        }
    };
}

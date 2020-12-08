import command from "./command";

export default class execute extends command {
    regex = /^(f)/;
    help = "execute:\t> f <arg>\t-> Function(arg)()";
    function = function(arg:string){
        if (!arg) {
            return (new execute).help;
        }
        try {
            return "execute: " + Function(arg)();
        } catch (e) {
            return "execute: " + e;
        }
    };
}

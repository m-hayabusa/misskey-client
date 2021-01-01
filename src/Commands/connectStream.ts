    import command from "./command";
    import API from "../Connection/API"
import Streaming from "../Connection/Streaming"
import {StreamingBody as StreamingBody} from "../Connection/Streaming"
import {input} from '../main';

export default class connectStream extends command {
    regex = /^(connect)/;
    help = "connectStream :\t> connect\t-> タイムラインにストリーミング接続します (開発中)";
    function = function(arg:string){
        let stream = new Streaming();
        
        connectStream.Id.set("homeTimeline", stream.connectChannel(new StreamingBody("homeTimeline"), (data:any)=>{
            // console.log(data);
            if (data.type === "note"){
                // input.prompt(false);
                process.stdout.write("\x1b[1A" + "\x1b[2K");

                if (data.body.renote) {
                    console.log("\x1b[G" + "\x1b[46m " + data.body.user.name + " \x1b[43m Re "
                                                 + "\x1b[42m " + data.body.renote.user.name + " \x1b[0m");
                } else {
                    console.log("\x1b[G" + "\x1b[46m " + data.body.user.name + " \x1b[0m");
                }

                console.log(data.body.text ? data.body.text : '\x1b[2m (本文なし) \x1b[0m')
                
                if (data.body.renote) {
                    process.stdout.write('-'.repeat(process.stdout.columns) + " \x1b[0m")

                    console.log("\x1b[G" + data.body.renote.text + " \x1b[0m")
                }

                let id = data.body.user.username + (data.body.user.host ? ('@' + data.body.user.host):'');
                if (data.body.renote){
                    id += ' Re '+data.body.renote.user.username + '@' + data.body.renote.user.host;
                }
                connectStream.notes.set(data.body.id.slice(-4), data.body.id)
                console.log("\x1b[G\x1b[47m\x1b[30m " + data.body.id.slice(-4) + ' ' + id + ' '.repeat(process.stdout.columns - data.body.createdAt.length - id.toString().length -2 -5 ) + data.body.createdAt + " \x1b[0m")
                
                input.prompt(true);
            }
        }));

        return "connectStream: " + arg;
    };
    static Id:Map<string, string> = new Map<string, string>();
    static notes:Map<string, string> = new Map<string, string>();
}

import command from "./command";
import API from "../Connection/API"
import Streaming from "../Connection/Streaming"
import {StreamingBody as StreamingBody} from "../Connection/Streaming"
import {input} from '../main';

export default class createNote extends command {
    regex = /^(connect)/;
    help = "connectStream :\t> connect\t-> タイムラインにストリーミング接続します (開発中)";
    function = function(arg:string){
        let stream = new Streaming();
        createNote.Id = stream.connectChannel(new StreamingBody("homeTimeline"), (data:any)=>{
            // console.log(data);
            if (data.type === "note"){
                console.log(data.body.user.name, data.body.user.username, data.body.user.host)
                console.log(data.body.text)
                input.prompt(true);
            }
        });

        console.log(createNote.Id);

        return "connectStream: " + arg;
    };
    static Id:string;
}

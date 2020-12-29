import API from "./API";
import websocket from 'ws'
import { v4 as uuidv4 } from 'uuid'
import {input} from '../main';

export class StreamingBody {
    public channel:string
    public id:string;
    public params:any;
    constructor(channel:string, id?:string, params?:any){
        this.id = (id===undefined ? uuidv4() : id);
        this.channel = channel;
        this.params = params;
    }
}

export default class Streaming {    
    static ws:websocket;
    static hook:Map<string,Function> = new Map<string,Function>();
    
    private msg = {
        content: function(content:string){ return content.replace(/<br( \/)?>/g,'\n')
                                                .replace(/<\/p><p>/g,'\n')
                                                .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'')
                                                .replace(/(&lt;)/g, '<')
                                                .replace(/(&gt;)/g, '>')
                                                .replace(/(&quot;)/g, '"')
                                                .replace(/(&#39;)/g, "'")
                                                .replace(/(&amp;)/g, '&')
                                                .replace(/(&apos;)/g, '\'')},
        notify:  function(display_name:string, acct:string, type:string, content=''){ return "\x1b[G\x1b[44m" + display_name + " @" + acct + "が\x1b[5m " + type + " \x1b[0m\x1b[44mしました" + (content && ": \n"+content) + "\x1b[0m"},
        footer:  function(id:string, created_at:string) { return "\x1b[G\x1b[47m\x1b[30m " + id + ' '.repeat(process.stdout.columns - created_at.length - id.toString().length -2) + created_at + " \x1b[0m"}
    };
    static isReady:boolean = false;

    constructor(forceReconnect = false){
        if (!Streaming.isReady || forceReconnect){
            Streaming.ws = new websocket("wss://" + API.accounts.get(API.account)?.getUri() + "/streaming?i=" + API.accounts.get(API.account)?.getKey());
            Streaming.ws.on('open', ()=>{Streaming.isReady = true;console.log("connected")})
            Streaming.ws.on("message", (str:any)=>{
                let data: any;
                try {
                    data = JSON.parse(str);
                } catch {
                    console.warn("ぶええええ")
                }
                // console.log(data.body.id);
                let hook = Streaming.hook.get(data.body.id)
                if (hook != null){
                    console.log();
                    hook(data.body);
                } else {
                    console.log(data.body);
                    input.prompt(true);
                };
            })
            Streaming.hook = new Map<string,Function>();
        }
    };

    public connectChannel(body:StreamingBody, callback:Function){
        if (!Streaming.isReady) {return "not_connected"}
        Streaming.ws.send(JSON.stringify({"type":"connect", "body": body}));
        Streaming.hook.set(body.id, callback);
        return body.id;
    }

    public disconnectChannel(id:string){
        let body = new StreamingBody("connect", id);
        Streaming.ws.send(JSON.stringify({"type":"disconnect", "body": body}));
        Streaming.hook.delete(id);
    }
}
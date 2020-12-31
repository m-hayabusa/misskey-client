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

    static isReady:boolean = false;

    constructor(forceReconnect = false){
        if (Streaming.isReady && forceReconnect){
            Streaming.isReady = false;
            Streaming.ws.close();
            Streaming.hook = new Map<string,Function>();
        }
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
            Streaming.ws.on('error', (err)=>{
                console.warn(err);
                Streaming.isReady = false;
            })
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
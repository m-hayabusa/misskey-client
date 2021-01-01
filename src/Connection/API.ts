import { v4 as uuidv4 } from 'uuid'
import { Url } from 'url';
import https from 'https'
import { input } from '../main';
import { createDiffieHellman } from 'crypto';
import Config from '../Interfaces/config';
import Streaming from "../Connection/Streaming"


export class misskeyCredential {
    constructor(domain: string, key: string) {
        this.domain = domain
        this.key = key
    }

    public getUri() {
        return this.domain
    }

    public getKey() {
        return this.key
    }

    private domain: string
    private key: string
}


export default class API {
    static accounts:Map<string, misskeyCredential>;
    static _account: string;
    static get account() {
        return API._account;
    }
    static set account(arg: string) {
        API._account = arg;/*
        let api = new API();
        api.request("meta", {}, ((ret: any) => {
            console.log("Misskey v" + ret.version);
            // console.log("Max Text Length: " + ret.maxNoteTextLength);
            input.prompt(true);
        }));*/
        
        new Streaming(true);
    }

    constructor() {
        const config = new Config;
        config.loadCredentials();
        if(API.account === undefined && API.accounts.size > 0){
            API.account = API.accounts.keys().next().value;
        }
    }

    public request(endpoint: string, reqbody: any, callback?: Function, auth=true, host?:string) {
        if (API.accounts.has(API.account)) {
            let credential = API.accounts.get(API.account);
            if (credential === undefined) return;
            reqbody.i = credential.getKey();
            if (host === undefined) host = credential.getUri();
        }

        // console.log("host", host);

        let ret: string
        
        const body = JSON.stringify(reqbody);
        // console.log(body);

        let req = https.request({
            hostname: host,
            path: '/api/' + endpoint,
            method: 'POST',
            headers: {
                'Content-Type': 'applications/json',
                'Content-Length': Buffer.byteLength(body)
            },
            agent: false
        }, (res: any) => {
            ret = ""
            if (res.statusCode != 200){
                console.log(res);
                console.log('statusCode:', res.statusCode);
                console.log('headers:', res.headers);
            }

            res.on('data', (chunk: string) => {
                // console.log(`BODY: ${chunk}`);
                ret += chunk
            });
            res.on('end', () => {
                // console.log(ret);
                if (callback) {
                    callback(JSON.parse(ret))
                } else {
                    input.prompt(true);
                }
            });
        })
        req.on('error', (e) => {
            console.error(e);
        });
        req.write(body);
        req.end();
    }
}
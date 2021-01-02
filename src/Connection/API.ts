import https from 'https';
import { config, input } from '../main';
import Streaming from "../Connection/Streaming";


export class misskeyCredential {
    constructor(domain: string, key: string) {
        this.domain = domain;
        this.key = key;
    }

    public getUri(): string {
        return this.domain;
    }

    public getKey(): string {
        return this.key;
    }

    private domain: string
    private key: string
}


export default class API {
    static accounts: Map<string, misskeyCredential>;
    static _account: string;
    static get account(): string {
        return API._account;
    }
    static set account(arg: string) {
        API._account = arg;

        new Streaming(true);
    }

    constructor() {
        config.loadCredentials();
        if (API.account === undefined && API.accounts.size > 0) {
            API.account = API.accounts.keys().next().value;
        }
    }

    public request(endpoint: string, reqbody: any, callback?: (param: string) => void, auth = true, host?: string): void {
        if (API.accounts.has(API.account)) {
            const credential = API.accounts.get(API.account);
            if (credential === undefined) return;
            reqbody.i = credential.getKey();
            if (host === undefined) host = credential.getUri();
        }

        // console.log("host", host);

        let ret: string;

        const body = JSON.stringify(reqbody);
        // console.log(body);

        const req = https.request({
            hostname: host,
            path: '/api/' + endpoint,
            method: 'POST',
            headers: {
                'Content-Type': 'applications/json',
                'Content-Length': Buffer.byteLength(body)
            },
            agent: false
        }, (res: any) => {
            ret = "";
            if (res.statusCode >= 400) {
                console.log(res);
                console.log('statusCode:', res.statusCode);
                // console.log('headers:', res.headers);
            }

            res.on('data', (chunk: string) => {
                // console.log(`BODY: ${chunk}`);
                ret += chunk;
            });
            res.on('end', () => {
                // console.log(ret);
                if (callback) {
                    callback(JSON.parse(ret));
                } else {
                    input.prompt(true);
                }
            });
        });
        req.on('error', (e) => {
            console.error(e);
        });
        req.write(body);
        req.end();
    }
}
import https from 'https';
import { Input } from '../Interfaces/input';
import Streaming from "../Connection/Streaming";
import { Config } from "../Interfaces/config";


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


class API {
    public accounts = new Map<string, misskeyCredential>();
    private _account = "";
    public get account(): string {
        Config.loadCredentials();
        if (this._account === "" && this.accounts.size > 0) {
            this._account = this.accounts.keys().next().value;
        }
        return this._account;
    }
    public set account(arg: string) {
        this._account = arg;

        new Streaming(true);
    }

    public request(endpoint: string, reqbody: any, callback?: (param: string) => void, auth = true, host?: string): void {
        if (this.accounts.has(this.account)) {
            const credential = this.accounts.get(this.account);
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
                    Input.prompt(true);
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

export const Api = new API();
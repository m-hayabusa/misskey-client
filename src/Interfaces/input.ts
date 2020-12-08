import { executionAsyncResource } from "async_hooks"
import { parse } from "querystring"
import Commands from "../Commands/commands"
import API from "../Connection/API"

export default class input {
    private reader:any

    constructor(){
        this.reader = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        })
    }
    private lines:string = ''

    public pause(){

    }
    public resume(){

    }
    public getLines(){
        return this.lines
    }

    public prompt(flag:Boolean){
        this.reader.setPrompt(API.account + " > ");
        return this.reader.prompt(flag)
    }

    public question(str:string, callback:Function){
        this.reader.question(str, callback)
    }

    private closeflag:boolean = false
    
    public input() {
        this.closeflag = false
        this.reader.on('line', function(this:input, line:string) {
            let cont = false

            if (!this.lines) {
                this.lines = ''
            }
            
            this.lines += line.replace(/\\$/,'') // lineがundefinedである可能性がある

            if (line.match(/\\$/)){
                cont = true
                this.lines += '\n'
            }

            if(!cont){
                // console.log(this.lines)
                let commands = new Commands
                commands.exec(this.lines)
                this.lines = ''
            }
            this.prompt(true)
        })
    
        this.reader.on('SIGINT', function(this:input){
            console.log("^C")
            if (this.closeflag) {
                console.log()
                process.exit(0)
            }
            if (this.lines === '') {            
                this.closeflag = true
                this.question('終了しますか？ [Y/n] >', (answer:string) => {
                    if (answer == '' || answer.match(/^y(es)?$/i)) process.exit(0)
                    
                    this.closeflag = false
                    this.prompt(true)
                })
            } else {
                this.lines = ''
                console.log("入力バッファをクリアしました")
            }
            this.prompt(true)
        })
        this.prompt(true)
    }
}
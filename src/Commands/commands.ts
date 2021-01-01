import command from "./command"
import {input} from '../main';

import help       from "./help"
import createNote from "./createNote"
import repostNote from "./repostNote"
import replyNote from "./replyNote"
import reactNote from "./reactNote"
import selectAccount from "./selectAccount"
import addAccount from "./addAccount"
import execute from "./execute"
import connectStream from "./connectStream"

export default class Commands {
    public commands:command[] = [new help, new createNote, new repostNote, new replyNote, new reactNote, new selectAccount, new addAccount, new execute, new connectStream]

    public exec(arg:string) {
        this.commands.forEach(e => {
            if(e.regex.test(arg)){
                console.log(e.function(arg.replace(e.regex, '').replace(/^ /,'')));
                input.prompt(true);
            }
        })
    }
}
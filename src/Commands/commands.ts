import command from "./command"
import {input} from '../main';

import help       from "./help"
import createNote from "./createNote"
import repostNote from "./repostNote"
import selectAccount from "./selectAccount"
import addAccount from "./addAccount"
import execute from "./execute"

export default class Commands {
    public commands:command[] = [new help, new createNote, new repostNote, new selectAccount, new addAccount, new execute]

    public exec(arg:string) {
        this.commands.forEach(e => {
            if(e.regex.test(arg)){
                console.log(e.function(arg.replace(e.regex, '').replace(/^ /,'')));
                input.prompt(true);
            }
        })
    }
}
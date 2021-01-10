import command from "./command";
import { Input } from '../Interfaces/input';

import help from "./help";
import createNote from "./createNote";
import repostNote from "./repostNote";
import replyNote from "./replyNote";
import reactNote from "./reactNote";
import selectAccount from "./selectAccount";
import addAccount from "./addAccount";
import execute from "./execute";
import connectStream from "./connectStream";
import { disconnectStream } from "./connectStream";

export default class Commands {
    public commands: command[] = [new help, new createNote, new repostNote, new replyNote, new reactNote, new selectAccount, new addAccount, new execute, new connectStream, new disconnectStream];

    public exec(arg: string): void {
        const regex = /(\S*)(?: (.*))?/s;
        this.commands.forEach(e => {
            if (e.regex.test(arg.replace(regex, '$1'))) {
                console.log(e.function(arg.replace(regex, '$2')));
                Input.prompt(true);
            }
        });
    }
}
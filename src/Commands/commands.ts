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

// function commands(line:string) {
//     if (line == '') {
//
//     } else if (line.match(/^(toot|t)/)) {
//         post(line.replace(/^(toot|t)/, ""), {}, visibility)
//     } else if (line.match(/^fav /)) {
//         let id = line.replace(/^fav /, "")
//         if (list.has(id)) {
//             fav(log.get(list.get(id)).id)
//         } else {
//             console.warn("\x1b[41mNG:Fav:wrongID\x1b[49m")
//         }
//     } else if (line.match(/^bt /)) {
//         let id = line.replace(/^bt /, "")
//         if (list.has(id)) {
//             rt(log.get(list.get(id)).id)
//         } else {
//             console.warn("\x1b[41mNG:BT:wrongID\x1b[49m")
//         }
//     } else if (line.match(/^re /)) {
//         let id = line.replace(/^re /, '').match(/^(\d*)/)[0]
//         if (list.has(id) && log.has(list.get(id))) {
//             let acct = log.get(list.get(id)).account.acct
//             post('@' + acct + ' ' + line.replace(/^re \d* /, ''), {in_reply_to_id: list.get(id)}, visibility)
//         } else {
//             console.warn("\x1b[41mNG:Re:wrongID\x1b[49m")
//         }
//     } else if (line.match(/^del /)) {
//         let id = line.replace(/^del /, "")
//         if (list.has(id)) {
//             del(log.get(list.get(id)).id)
//         } else {
//             console.warn("\x1b[41mNG:Del:wrongID\x1b[49m")
//         }
//     } else if (line.match(/^select /)) {
//         let input = line.replace(/^select /, "").toUpperCase()
//         if (input.match(/(HTL|LTL|FTL)/)) {
//             if (input.match(/FTL/)) {
//                 Active.FTL = true
//                 if (isConnected['FTL'] === false) {
//                     client['FTL'].connect("wss://" + config.domain + "/api/v1/streaming/?access_token=" + config.token + "&stream=public")
//                 }
//             } else {
//                 Active.FTL = false
//             }

//             if (input.match(/LTL/)) {
//                 Active.LTL = true
//                 if (isConnected['LTL'] === false) {
//                     client['LTL'].connect("wss://" + config.domain + "/api/v1/streaming/?access_token=" + config.token + "&stream=public:local")
//                 }
//             } else {
//                 Active.LTL = false
//             }

//             if (input.match(/HTL/)) {
//                 Active.HTL = true
//                 if (isConnected['HTL'] === false) {
//                     client['HTL'].connect("wss://" + config.domain + "/api/v1/streaming/?access_token=" + config.token + "&stream=user")
//                 }
//             } else {
//                 Active.HTL = false
//             }

//             console.log('\x1b[G' + "\x1b[42m" + input + 'にストリームを切り替えました\x1b[49m')
//         } else {
//             console.log("\x1b[G\x1b[41m> select (HTL|LTL|FTL)\x1b[0m")
//         }
//     } else if (line.match(/^pause/)) {
//         Active = false
//         console.log('\x1b[G\x1b[46mストリームの表示を停止します\x1b[49m')
//     } else if (line.match(/^set /)) {
//         line = line.replace(/^set /, '')
//         if (line.match(/^vis /)) {
//             visibility = line.replace(/^vis /, '')
//         }
//     } else if (line.match(/^help/)) {
//         console.log("\x1b[Gつかいかた: ")
//         console.log("\x1b[G > select <HTL|LTL|FTL>")
//         console.log("\x1b[G > t <トゥート>")
//         console.log("\x1b[G > re <ID> <返信>")
//         console.log("\x1b[G > fav <ID>")
//         console.log("\x1b[G > bt <ID>")
//         console.log("\x1b[G > set vis <direct|private|unlisted|public>")
//         console.log("\x1b[G > exit")
//         console.log("\x1b[G > pause")
//     } else if (line.match(/^exit/)) {
//         console.log('\x1b[G\x1b[46m終了します\x1b[49m')
//         process.exit(0)
//     } else if (line.match(/^f /)) {
//         try {
//             console.log(eval(line.replace(/^f /, '')))
//         } catch(e) {
//             console.log(e)
//         }
//     } else {
//         console.log("\x1b[G\x1b[41m不明なコマンドです\x1b[49m")
//     }
// }

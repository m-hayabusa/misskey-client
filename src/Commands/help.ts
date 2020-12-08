import command from "./command"

import Commands from "./commands"

export default class help extends command {
    regex = /^(help|h)$/
    help  = "help:\t> help\t-> このヘルプが表示されます"
    function = function(arg:string){
        let ret:string = ""

        for (let e of (new Commands).commands)
            ret += "\x1b[G > " + e.help + "\n"

        return (
            "\x1b[Gつかいかた:\n" +
            ret +
            "\x1b[G ショートカットキー類"+
            "\x1b[G > ^C -> 入力バッファをクリアします\n" +
            "\x1b[G > ^D -> 終了します\n" + 
            "\x1b[G > ^L -> 画面を消去します\n"
        )
    }
}
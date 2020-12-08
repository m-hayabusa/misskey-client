import command from "./command"

export default class repostNote extends command {
    regex = /^(renote|r)/
    help = "repostNote:\t> re <投稿ID>\t-> 投稿をリポストします"
    function = function(arg:string){
        return arg
    }
}
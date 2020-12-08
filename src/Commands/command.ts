export default class command {
    public regex:RegExp = /(?!)/
    public help:string = ""
    public function(arg:string):string {
        return arg
    } 
}
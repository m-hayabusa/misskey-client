export default class command {
    public regex = /(?!)/
    public help = ""
    public function(arg: string): string {
        return arg;
    }
}
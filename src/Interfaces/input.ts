import Commands from "../Commands/commands";
import API from "../Connection/API";
import readline from "readline";

export default class input {
    private reader: any
    private lines = ''

    constructor() {
        this.reader = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    public getLines(): string {
        return this.lines;
    }

    public prompt(flag: boolean): string {
        this.reader.setPrompt(API.account + " > ");
        return this.reader.prompt(flag);
    }

    public question(str: string, callback: (param: string) => void): void {
        this.reader.question(str, callback);
    }

    private closeflag = false

    public input(): void {
        this.closeflag = false;
        this.reader.on('line', function (this: input, line: string) {
            let cont = false;

            if (!this.lines) {
                this.lines = '';
            }

            this.lines += line.replace(/\\$/, ''); // lineがundefinedである可能性がある

            if (line.match(/\\$/)) {
                cont = true;
                this.lines += '\n';
            }

            if (!cont) {
                // console.log(this.lines)
                const commands = new Commands;
                commands.exec(this.lines);
                this.lines = '';
            }
            this.prompt(true);
        });

        this.reader.on('SIGINT', function (this: input) {
            console.log("^C");
            if (this.closeflag) {
                console.log();
                process.exit(0);
            }
            if (this.lines === '') {
                this.closeflag = true;
                this.question('終了しますか？ [Y/n] >', (answer: string) => {
                    if (answer == '' || answer.match(/^y(es)?$/i)) process.exit(0);

                    this.closeflag = false;
                    this.prompt(true);
                });
            } else {
                this.lines = '';
                console.log("入力バッファをクリアしました");
            }
            this.prompt(true);
        });
        this.prompt(true);
    }
}
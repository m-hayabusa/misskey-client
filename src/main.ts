import Input from "./Interfaces/input"
import API from "./Connection/API"
import {misskeyCredential} from "./Connection/API" 

export let input = new Input()

function main() {
    console.log("hello.")
    const api = new API();

    input.input()
}

main()
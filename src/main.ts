import Input from "./Interfaces/input";
import Config from './Interfaces/config';
import API from './Connection/API';

export const input = new Input();
export const config = new Config();
export const api = new API();

function main() {
    console.log("hello.");

    input.input();
}

main();
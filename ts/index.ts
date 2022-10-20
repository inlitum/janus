import {Backgrounds} from "./backgrounds.js";
import {Accounts} from "./accounts.js";

export {}

declare global {
    interface Window {
        backgrounds: Backgrounds;
        accounts: Accounts;
    }
}

async function initGreeter(): Promise<void> {

    window.accounts = new Accounts();

    window.backgrounds = new Backgrounds();
    await window.backgrounds.init();
}

window.addEventListener("GreeterReady", () => {
    initGreeter();
});

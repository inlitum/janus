import {Backgrounds}      from "./backgrounds.js";
import {Accounts}         from "./accounts.js";
import { Authentication } from './authentication.js';
import { Sessions }       from './sessions.js';
import { Power }          from './power.js';

export {}

declare global {
    interface Window {
        wait: (ms: number) => Promise<void>;
        backgrounds: Backgrounds;
        accounts: Accounts;
        authentication: Authentication;
        sessions: Sessions;
        power: Power;
    }
}

async function wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

window.wait = wait;

async function initGreeter(): Promise<void> {

    window.accounts = new Accounts();

    window.sessions = new Sessions();

    window.authentication = new Authentication();

    window.power = new Power();

    window.backgrounds = new Backgrounds();
    await window.backgrounds.init();
}

window.addEventListener("GreeterReady", () => {
    initGreeter();
});

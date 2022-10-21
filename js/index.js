import { Backgrounds } from "./backgrounds.js";
import { Accounts } from "./accounts.js";
import { Authentication } from './authentication.js';
import { Sessions } from './sessions.js';
import { Power } from './power.js';
async function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
window.wait = wait;
async function initGreeter() {
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
//# sourceMappingURL=index.js.map
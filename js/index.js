import { Backgrounds } from "./backgrounds.js";
import { Accounts } from "./accounts.js";
async function initGreeter() {
    window.accounts = new Accounts();
    window.backgrounds = new Backgrounds();
    await window.backgrounds.init();
}
window.addEventListener("GreeterReady", () => {
    initGreeter();
});
//# sourceMappingURL=index.js.map
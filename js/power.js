export class Power {
    constructor() {
        this._canShutdown = false;
        this._canRestart = false;
        this._canHibernate = false;
        this._canSuspend = false;
        if (!window.lightdm) {
            return;
        }
        // Get which buttons can be activated, if any are false then they will be hidden.
        this._canShutdown = window.lightdm.can_shutdown ?? false;
        this._canRestart = window.lightdm.can_restart ?? false;
        this._canHibernate = window.lightdm.can_hibernate ?? false;
        this._canSuspend = window.lightdm.can_suspend ?? false;
        this._fetchElements();
        this._initialiseListeners();
    }
    _fetchElements() {
        // Get all the buttons
        const shutdownButton = document.querySelector('#shutdown');
        const restartButton = document.querySelector('#restart');
        const hibernateButton = document.querySelector('#hibernate');
        const suspendButton = document.querySelector('#suspend');
        // Get the main control card.
        const control = document.querySelector('#control');
        if (shutdownButton && shutdownButton instanceof HTMLButtonElement) {
            this._shutdownButton = shutdownButton;
            if (!this._canShutdown) {
                this._shutdownButton.classList.add('hidden');
            }
        }
        if (restartButton && restartButton instanceof HTMLButtonElement) {
            this._restartButton = restartButton;
            if (!this._canRestart) {
                this._restartButton.classList.add('hidden');
            }
        }
        if (hibernateButton && hibernateButton instanceof HTMLButtonElement) {
            this._hibernateButton = hibernateButton;
            if (!this._canHibernate) {
                this._hibernateButton.classList.add('hidden');
            }
        }
        if (suspendButton && suspendButton instanceof HTMLButtonElement) {
            this._suspendButton = suspendButton;
            if (!this._canSuspend) {
                this._suspendButton.classList.add('hidden');
            }
        }
        if (control && control instanceof HTMLDivElement) {
            this._control = control;
            // If any of the buttons can be activated, show the control card. If not, keep it hidden.
            if (this._canShutdown || this._canRestart || this._canHibernate || this._canSuspend) {
                this._control.classList.remove('hidden');
            }
        }
    }
    _initialiseListeners() {
        if (!this._shutdownButton || !this._restartButton || !this._hibernateButton || !this._suspendButton) {
            return;
        }
        this._shutdownButton.addEventListener('click', async () => {
            if (!window.lightdm || !window.lightdm.can_shutdown)
                return;
            await window.wait(1000);
            window.lightdm.shutdown();
        });
        this._restartButton.addEventListener('click', async () => {
            if (!window.lightdm || !window.lightdm.can_restart)
                return;
            await window.wait(1000);
            window.lightdm.restart();
        });
        this._hibernateButton.addEventListener('click', async () => {
            if (!window.lightdm || !window.lightdm.can_hibernate) {
                return;
            }
            await window.wait(1000);
            window.lightdm.hibernate();
        });
        this._suspendButton.addEventListener('click', async () => {
            if (!window.lightdm || !window.lightdm.can_suspend)
                return;
            await window.wait(1000);
            window.lightdm.suspend();
        });
    }
}
//# sourceMappingURL=power.js.map
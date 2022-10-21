export class Authentication {

    private _username: string = '';
    private _password: string = '';

    private _usernameTextbox: HTMLInputElement | undefined;
    private _passwordTextbox: HTMLInputElement | undefined;
    private _submitButton: HTMLButtonElement | undefined;
    private _passwordError: HTMLDivElement | undefined;
    private _usernameError: HTMLDivElement | undefined;
    private _loginSuccess: HTMLDivElement | undefined;

    private _fetchElements () {
        const username = document.querySelector('#username');
        const password = document.querySelector('#password');
        const usernameError = document.querySelector('#usernameError');
        const passwordError = document.querySelector('#passwordError');
        const loginSuccess = document.querySelector('#loginSuccess');
        const submit = document.querySelector('#loginSubmit');

        if (username instanceof HTMLInputElement) {
            this._usernameTextbox = username;
        }

        if (password instanceof HTMLInputElement) {
            this._passwordTextbox = password;
        }

        if (usernameError instanceof HTMLDivElement) {
            this._usernameError = usernameError;
        }

        if (passwordError instanceof HTMLDivElement) {
            this._passwordError = passwordError;
        }

        if (loginSuccess instanceof HTMLDivElement) {
            this._loginSuccess = loginSuccess;
        }

        if (submit instanceof HTMLButtonElement) {
            this._submitButton = submit;
        }
    }

    private _initialiseListeners () {
        if (!window.lightdm) {
            return;
        }

        const me = this;
        if (!this._passwordTextbox || !this._submitButton) {
            return;
        }

        this._passwordTextbox.addEventListener('keyup', (event) => {
            if (!event) {
                return;
            }

            if (event.code === 'Enter') {
                me.doLogin();
            }
        })

        this._submitButton.addEventListener('click', () => {
            me.doLogin();
        });

        window.lightdm.show_prompt.connect((message, type) => {
            if (!window.lightdm) return;
            if (type === 0) {
                //Prompt username
                window.lightdm.respond(this._username);
            } else if (type == 1 && window.lightdm.is_authenticated) {
                // Prompt password
                window.lightdm.respond(this._password);
            }
        });

        window.lightdm?.authentication_complete.connect(() => {
            if (window.lightdm?.is_authenticated) {
                console.log('success')
                this._authenticationSuccess();
            } else {
                console.log('failed')
                // this._authenticationFailed();
            }
        });
    }

    private doLogin() {
        if (!this._usernameTextbox || !this._passwordTextbox || !this._usernameError || !this._passwordError) {
            return;
        }


        this._usernameTextbox.blur();
        this._passwordTextbox.blur();
        this._passwordTextbox.disabled = true;

        // Fetch them form data bb.
        const username = `${this._usernameTextbox.value}`;
        const password = `${this._passwordTextbox.value}`;

        if (!username || username === '') {
            this._usernameError.innerText = 'A valid user must be selected';
            return;
        } else {
            this._usernameError.innerText = '';
        }

        if (!password || password === '') {
            this._passwordError.innerText = 'A password must be entered.';
            this._passwordTextbox.disabled = false;
            this._passwordTextbox.focus();
            return;
        } else {
            this._passwordError.innerText = '';
        }

        this._username = username;
        this._password = password;
    }

    private async _authenticationSuccess (): Promise<void> {
        const selectedSession = window.sessions.getSelectedSession();

        if (!this._usernameError || !this._passwordError || !this._loginSuccess || !selectedSession || !window.lightdm) {
            await this._authenticationFailed ();
            return;
        }

        this._usernameError.innerText = '';
        this._passwordError.innerText = '';
        this._loginSuccess.innerText = 'success';

        await window.wait(1000);
        window.lightdm.start_session(selectedSession.key ?? window.lightdm.default_session);
    }

    private async _authenticationFailed (): Promise<void> {
        if (!this._usernameError || !this._passwordError || !this._loginSuccess || !this._usernameTextbox || !this._passwordTextbox) {
            await this._authenticationFailed ();
            return;
        }

        this._usernameError.innerText = '';
        this._passwordError.innerText = 'failed';
        this._loginSuccess.innerText = '';

        this._usernameTextbox.blur();
        this._usernameTextbox.disabled = true;
        this._passwordTextbox.blur();
        this._passwordTextbox.disabled = false;
        this._passwordTextbox.value = "";
    }

    public constructor () {
        this._fetchElements();
        this._initialiseListeners();
    }
}
import { LightDMUser } from 'nody-greeter-types';
import ClickEvent = JQuery.ClickEvent;

export class Accounts {

    private _users: LightDMUser[] | undefined;

    private _usernameInput: HTMLInputElement | undefined;
    private _userDropdown: HTMLDivElement | undefined;
    private _userDropdownButton: HTMLButtonElement | undefined;

    private _selectedUser: LightDMUser | undefined;

    private _showingDropdown: boolean = false;

    private readonly defaultUserKey = 'defaultUser';

    public getSelectedUser (): LightDMUser | null {
        return this._selectedUser ?? null;
    }

    private fetchFirstUser (): LightDMUser | undefined {
        if (!this._users || this._users.length <= 0) {
            return;
        }
        let defaultUser = window.localStorage.getItem (this.defaultUserKey);

        let user: LightDMUser | undefined;

        try {
            user = JSON.parse (defaultUser ?? '');
        } catch {
            user = this._users[ 0 ];
        }

        if (!user) {
            return;
        }

        return user;
    }

    private setAccountsList (): void {
        if (!this._users || this._users.length === 0 || !this._userDropdown) {
            return;
        }

        if (this._users.length === 1 && this._userDropdownButton) {
            // this._userDropdownButton.hidden = true;
            // return;
        }

        let children = this._userDropdown.children;
        if (children.length > 0) {
            for (let child of children) {
                this._userDropdown.removeChild(child);
            }
        }

        for (let user of this._users) {
            const aElement = document.createElement('a');
            aElement.classList.add('user-dropdown-item');
            aElement.innerText = user.username;

            if (this._selectedUser && user.username === this._selectedUser.username) {
                aElement.classList.add('selected');
            }

            this._userDropdown.appendChild(aElement);
        }

        document.querySelector('.user-dropdown-items')?.addEventListener('click', (event: Event) => {
            console.log(event)
        })
    }

    private setFirstAccount (): void {
        if (this._usernameInput && this._selectedUser) {
            this._usernameInput.value = this._selectedUser.username;
            if (window.sessions) window.sessions.handleUserChange(this._selectedUser);
        }
    }

    private initialiseElements () {
        const me = this;
        const usernameInput = document.querySelector('#username');
        if (usernameInput && usernameInput instanceof HTMLInputElement) {
            this._usernameInput = usernameInput;
        }

        const userDropdown = document.querySelector('#userDropdown');
        if (userDropdown && userDropdown instanceof HTMLDivElement) {
            this._userDropdown = userDropdown;
        }

        const userDropdownButton = document.querySelector('#userDropdownButton');
        if (userDropdownButton && userDropdownButton instanceof HTMLButtonElement) {
            this._userDropdownButton = userDropdownButton;
            this._userDropdownButton.addEventListener('click', () => {
                this.toggleUserDropdown()
            })
        }

        window.onclick = function(event) {
            let target = (<HTMLElement>event.target);

            if (!target) {
                return;
            }

            if (!me._showingDropdown) {
                return;
            }

            if (me._showingDropdown && target) {
                if (target.classList.contains('user-dropdown-item')) {
                    let selectedUser = target.innerText;
                    me.switchUser(selectedUser);
                }

                if (target.id !== 'userDropdownButton' && !target.classList.contains('user-dropdown-icon')) {
                    me.toggleUserDropdown();
                }
            }
        }
    }

    public toggleUserDropdown () {
        if (!this._userDropdown || !this._userDropdownButton) {
            return;
        }

        let chevron = document.createElement('i');
        chevron.classList.add('fa-solid');
        chevron.classList.add('user-dropdown-icon');

        if (this._showingDropdown) {
            chevron.classList.add('fa-chevron-right');
            this._userDropdown.classList.remove('show');
            this._showingDropdown = false;
        } else {
            chevron.classList.add('fa-chevron-down');
            this._userDropdown.classList.add('show');
            this._showingDropdown = true;
        }

        let child = this._userDropdownButton.firstElementChild;

        if (!child) {
            this._userDropdownButton.appendChild(chevron);
        } else {
            this._userDropdownButton.replaceChild(chevron, child);
        }
        this._userDropdownButton.classList.toggle('dropdown-active');
    }

    private switchUser(username: string) {
        if (username && username === '' || !this._users) {
            return;
        }
        // Get the user
        let user: LightDMUser | undefined;

        for (let u of this._users) {
            if (u.username === username) {
                user = u;
                break;
            }
        }

        this._selectedUser = user;

        this.setFirstAccount();
    }

    public constructor () {
        this.initialiseElements();
        // If light dm isn't defined, don't do anything.
        if (!window.lightdm) return;
        this._users     = window.lightdm.users;
        this._selectedUser = this.fetchFirstUser ();

        if (!this._selectedUser) {
            return;
        }

        this.setAccountsList ();
        this.setFirstAccount ();
    }
}

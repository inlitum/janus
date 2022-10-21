import { LightDMSession, LightDMUser } from 'nody-greeter-types';

export class Sessions {

    private _sessionsList: HTMLUListElement | undefined;

    private _selectedSession: LightDMSession | null = null;
    private _sessions: LightDMSession[] = [];

    public constructor () {
        if (!window.lightdm) return;
        this._sessions = window.lightdm.sessions;
        this._fetchComponents();
        this._initiateListeners();

        const selectedUser = window.accounts.getSelectedUser();
        if (selectedUser != null) {
            this._setSelectedSession(selectedUser.session);
        }

        this._generateSessionsList();
    }

    public getSelectedSession(): LightDMSession | null {
        return this._selectedSession;
    }

    public handleUserChange (user: LightDMUser) {
        const session = user.session;
        this._setSelectedSession (session);
        this._generateSessionsList();
    }

    private _fetchComponents () {
        const sessionsList = document.querySelector('.sessions-list');

        if (sessionsList instanceof HTMLUListElement) {
            this._sessionsList = sessionsList;
        }
    }

    private _generateSessionsList () {
        if (!this._sessionsList || !this._sessions) return;

        this._sessionsList.innerText = '';

        for (const session of this._sessions) {
            const sessionName = session.name.toLowerCase();
            const sessionType = session.type.toLowerCase();

            const sessionItem = document.createElement('li');
            sessionItem.classList.add('session-item');

            const input = document.createElement('input');
            const label = document.createElement('label');

            if (!(input instanceof HTMLInputElement) || !(label instanceof HTMLLabelElement)) {
                return;
            }

            input.type = 'radio';
            input.id = `${sessionName}-${sessionType}`;
            input.name = 'session';
            input.value = `${sessionName}-${sessionType}`;

            if (this._selectedSession && this._selectedSession.name.toLowerCase() === sessionName) {
                input.checked = true;
            }

            label.setAttribute('for', `${sessionName}-${sessionType}`);
            label.innerText = sessionName;

            sessionItem.appendChild(input);
            sessionItem.appendChild(label);

            this._sessionsList.appendChild(sessionItem);
        }
    }

    private _initiateListeners () {
        const me = this;
        document.addEventListener('click', function (event) {
            if (!event || !event.target) {
                return;
            }
            const target = <HTMLElement>event.target;

            if ( target.getAttribute('name') == 'session' && target instanceof HTMLInputElement) {
                let value = target.value.split('-');

                let name = value[0];
                let type = value[1];

                me._setSelectedSession(name, type);
            }
        }, false);
    }

    private _setSelectedSession (name: string, type: string | null = null) {
        if (!name || name === '') {
            return;
        }

        for (const session of this._sessions) {
            if (session.name.toLowerCase() === name) {
                if (type && type !== '') {
                    if (session.type.toLowerCase() !== type.toLowerCase()) {
                        continue;
                    }
                }

                this._selectedSession = session;
                return;
            }
        }
    }
}
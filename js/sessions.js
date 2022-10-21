export class Sessions {
    constructor() {
        this._selectedSession = null;
        this._sessions = [];
        if (!window.lightdm)
            return;
        this._sessions = window.lightdm.sessions;
        this._fetchComponents();
        this._initiateListeners();
        const selectedUser = window.accounts.getSelectedUser();
        if (selectedUser != null) {
            this._setSelectedSession(selectedUser.session);
        }
        this._generateSessionsList();
    }
    getSelectedSession() {
        return this._selectedSession;
    }
    handleUserChange(user) {
        const session = user.session;
        this._setSelectedSession(session);
        this._generateSessionsList();
    }
    _fetchComponents() {
        const sessionsList = document.querySelector('.sessions-list');
        if (sessionsList instanceof HTMLUListElement) {
            this._sessionsList = sessionsList;
        }
    }
    _generateSessionsList() {
        if (!this._sessionsList || !this._sessions)
            return;
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
    _initiateListeners() {
        const me = this;
        document.addEventListener('click', function (event) {
            if (!event || !event.target) {
                return;
            }
            const target = event.target;
            if (target.getAttribute('name') == 'session' && target instanceof HTMLInputElement) {
                let value = target.value.split('-');
                let name = value[0];
                let type = value[1];
                me._setSelectedSession(name, type);
            }
        }, false);
    }
    _setSelectedSession(name, type = null) {
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
//# sourceMappingURL=sessions.js.map
import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { PersistenceService } from 'charactersheet/services/common';
import { Party } from 'charactersheet/models/common';
import autoBind from 'auto-bind';
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import * as awarenessProtocol from 'y-protocols/awareness.js'
import { debounce } from 'lodash';
import { observable } from 'knockout';


class _PartyService {

    constructor({ REFRESH_INTERVAL }) {
        autoBind(this);

        this.party = null;
        this.refreshInterval = REFRESH_INTERVAL;

        this.setupNotifications();
    }

    setupNotifications() {
        Notifications.coreManager.changed.add(
            this.checkForPartyAndSetupPollingIfNeccessary
        );
    }

    async checkForPartyAndSetupPollingIfNeccessary() {
        await this.refresh();
        if (!!this.party) {
            console.log('Party auto-refresh enabled.')
            this.configureTimers();
            this.configureConnection();
        }
    }

    // Timers

    configureTimers() {
        this.resetTimers();
        this.timer = setInterval(this.refresh, this.refreshInterval);
    }

    resetTimers() {
        if (!!this.timer) {
            clearInterval(this.timer);
        }
    }

    // Presence

    configureConnection() {
        const token = PersistenceService.findAllByName('AuthenticationToken')[0];
        if (!token || !token.accessToken()) {
            console.log(
                'Warning: User has no auth token. Cannot set up websocket connection.'
            );
            return;
        }

        this.doc = new Y.Doc(this.party.uuid);
        this.awareness = new awarenessProtocol.Awareness(this.doc);
        this.provider = new WebsocketProvider(
            WS_URL,
            this.party.uuid,
            this.doc,
            { awareness: this.awareness, params: { bearer: token.accessToken() } }
        );

        this.awareness.on('change', () => {
            this._debouncedRefresh();
        });

        this.provider.on('status', event => {
            this.status(this.Status[event.status]);
            Notifications.party[event.status].dispatch(this.party);
        })

        this.updatePresence();
    }

    shutdownConnection() {
        this.provider.disconnect();
    }

    updatePresence(additionalData={}) {
        this._presenceState = {
            // Any old data
            ...this._presenceState,
            // ...plus any new data
            ...additionalData,
            // ...plus the required stuff
            id: CoreManager.activeCore().uuid(),
        };

        // This prevents multiple calls to updatePresence()
        // from spamming the socket connection.
        this._debouncedUpdatePresence();
    }

    _presenceState = {};

    /**
     * The debounced call to update presence. This ensures
     * that the call to actually update the presence doesn't
     * actually update anything until things have calmed down
     * and we aren't spamming the socket connection with
     * tons of updates when things change.
     */
    _debouncedUpdatePresence = debounce(
        () => {
            this.awareness.setLocalState({
                ...this._presenceState,
                // Append a random number to ensure the
                // state actually changes even if we are
                // setting the same value as before.
                _r: (Math.random() * 1000000) | 0,
            })
        },
        350,
        { maxWait: 1000 }
    );

    Status = {
        // The user is not in a party.
        noParty: 'noParty',
        // The socket is disconnected
        disconnected: 'disconnected',
        // The socket connection is connecting.
        connecting: 'connecting',
        // The socket connection is established.
        connected: 'connected',
    }

    status = observable(this.Status.noParty);

    playerIsOnline(coreUuid) {
        if (!this.awareness) {
            return false;
        }

        const states = this.awareness.states;
        console.log(states, coreUuid)
        // Do any of the current awareness states contain a value
        // with the id we were just given? If so, they're online.
        for (const value of states.values()) {
            if (value.id === coreUuid) {
                return true;
            }
        }
        return false;
    }

    // Poll

    async refresh(forceNotify=false) {
        const party = await this._fetchParty();
        if (forceNotify || this._isDifferent(this.party, party)) {
            this._setParty(party);
        }
    };

    _debouncedRefresh = debounce(
        async () => {
            await this.refresh(true);
        },
        500,
        { maxWait: 1000 }
    )

    // Actions

    async join(coreUuid, shortCode) {
        const { data: party } = await Party.join(coreUuid, shortCode);
        this._setParty(party);
        this.configureTimers();
        this.configureConnection();
        return party;
    }

    async leave(coreUuid) {
        await Party.leave(coreUuid);
        this._setParty(null);
        this.resetTimers();
        this.shutdownConnection();
    }

    async create(coreUuid) {
        const { data: party } = await Party.ps.create({ uuid: coreUuid });
        this._setParty(party);
        this.configureTimers();
        this.configureConnection();
        return party;
    }

    async delete(coreUuid) {
        await Party.ps.delete({ uuid: coreUuid });
        this._setParty(null);
        this.resetTimers();
        this.shutdownConnection();
    }

    // Private

    _fetchParty = async () => {
        let uuid;
        try {
            uuid = CoreManager.activeCore().uuid();
        } catch(error) {
            console.warn('No core to begin fetching details for.', error);
            return null;
        }

        try {
            const { data: party } = await Party.ps.read(
                { uuid },
                false,
                false,
            );
            return party;
        } catch(error) {
            console.warn(error);
            return null;
        }
    }

    _isDifferent(a, b) {
        let isDifferent = false;
        try {
            // Do a deep-copy compare of string hashes. This will catch all
            // changes in the response data.
            isDifferent = (
                btoa(JSON.stringify(a)) !== btoa(JSON.stringify(b))
            );
        } catch(error) {
            // We got here because one of the two is null,
            // so we just need to check if one isn't null.
            isDifferent = (!!a !== !!b);
        }
        return isDifferent;
    }

    _setParty(party) {
        this.party = party;
        Notifications.party.changed.dispatch(this.party);
    }
}

export const PartyService = new _PartyService({
    REFRESH_INTERVAL: 300000,  // 5 minutes
});

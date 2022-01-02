import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { Party } from 'charactersheet/models/common';
import autoBind from 'auto-bind';
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import * as awarenessProtocol from 'y-protocols/awareness.js'


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
            this.configurePresence();
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

    configurePresence() {
        this.doc = new Y.Doc(this.party.uuid);
        this.awareness = new awarenessProtocol.Awareness(this.doc);
        this.provider = new WebsocketProvider(
            'ws://localhost:1234',
            this.party.uuid,
            this.doc,
            { awareness: this.awareness }
        );

        this.awareness.on('change', (a, u, r) => {
            console.log('Added', a, 'Updated', u, 'Removed', r);
        });

        this.awareness.setLocalState({ id: CoreManager.activeCore().uuid() });
    }

    // Poll

    async refresh() {
        let uuid;
        try {
            uuid = CoreManager.activeCore().uuid();
        } catch(error) {
            console.warn('No core to begin fetching details for.', error);
            return;
        }

        try {
            const { data: party } = await Party.ps.read(
                { uuid },
                false,
                false,
            );
            this._setParty(party);
        } catch(error) {
            this._setParty(null);
            console.warn(error);
        }
    };

    // Actions

    async join(coreUuid, shortCode) {
        const { data: party } = await Party.join(coreUuid, shortCode);
        this._setParty(party);
        this.configureTimers();
        return party;
    }

    async leave(coreUuid) {
        await Party.leave(coreUuid);
        this._setParty(null);
        this.resetTimers();
    }

    async create(coreUuid) {
        const { data: party } = await Party.ps.create({ uuid: coreUuid });
        this._setParty(party);
        this.configureTimers();
        return party;
    }

    async delete(coreUuid) {
        await Party.ps.delete({ uuid: coreUuid });
        this._setParty(null);
        this.resetTimers();
    }

    // Private

    _setParty(party) {
        let didChange = false;
        try {
            // Do a deep-copy compare of string hashes. This will catch all
            // changes in the response data.
            didChange = (
                btoa(JSON.stringify(this.party)) !== btoa(JSON.stringify(party))
            );
        } catch(error) {
            // We got here because one of the two is null,
            // so we just need to check if one isn't null.
            didChange = (!!party !== !!this.party);
        }

        if (didChange) {
            this.party = party;
            Notifications.party.changed.dispatch(this.party);
        }
    }
}

export const PartyService = new _PartyService({
    REFRESH_INTERVAL: 3000,  // seconds
});

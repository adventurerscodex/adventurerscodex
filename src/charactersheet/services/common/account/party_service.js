import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { Party } from 'charactersheet/models/common';
import autoBind from 'auto-bind';


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

    async leave() {
        await Party.leave(coreUuid);
        this._setParty(null);
        this.resetTimers();
    }

    async create() {
        const { data: party } = await Party.ps.create(coreUuid);
        this._setParty(party);
        this.configureTimers();
        return party;
    }

    async delete() {
        await Party.ps.delete(coreUuid);
        this._setParty(null);
        this.resetTimers();
    }

    // Private

    _setParty(party) {
        this.party = party;

        // TODO: Notify
    }
}

export const PartyService = new _PartyService({
    REFRESH_INTERVAL: 3000,  // seconds
});

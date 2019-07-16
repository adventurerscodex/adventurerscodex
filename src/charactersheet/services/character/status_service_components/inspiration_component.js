import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { OtherStats } from 'charactersheet/models/character/other_stats';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { Status } from 'charactersheet/models/common/status';

import ko from 'knockout';
/**
 * A Status Service Component that tracks the total weight that a character
 * is carrying, and any modifiers that are applied due to this weight.
 */
export function InspirationStatusServiceComponent() {
    var self = this;

    self.statusIdentifier = 'Status.Inspired';

    self.init = async function() {
        await self.load();
        self.setUpSubscriptions();
    };

    self.setUpSubscriptions = () => {
        Notifications.otherstats.changed.add(self.statsHasChanged);
        Notifications.coreManager.changing.add(self.coreHasChanged);
    };

    self.coreHasChanged = (oldCore, newCore) => {
        self._removeStatus(oldCore.uuid());
        self.load(newCore);
    };

    self.load = async (core) => {
        let activeCore;
        if (core) {
            activeCore = core;
        } else {
            activeCore = CoreManager.activeCore();
        }
        if (ko.utils.unwrapObservable(activeCore.type.name) !== 'character') {
            return;
        }
        var coreKey = activeCore.uuid();
        var otherStatsResponse = await OtherStats.ps.read({uuid: coreKey});
        let otherStats = otherStatsResponse.object;
        if (!otherStats.inspiration()) {
            self._removeStatus(coreKey);
        } else {
            self._updateStatus(coreKey);
        }
    };
    /**
     * This method generates and persists a status that reflects
     * the character's encumbrance.
     */
    self.statsHasChanged = (otherStats) => {
        if (!otherStats) { return; }
        if (!otherStats.inspiration()) {
            self._removeStatus(otherStats.uuid());
        } else {
            self._updateStatus(otherStats.uuid());
        }
    };

    /* Private Methods */

    self._updateStatus = function(coreKey) {
        var status = PersistenceService.findByPredicates(Status,
            [new KeyValuePredicate('characterId', coreKey),
            new KeyValuePredicate('identifier', self.statusIdentifier)])[0];

        if (!status) {
            status = new Status();
            status.characterId(coreKey);
            status.identifier(self.statusIdentifier);
        }

        status.name('inspired');
        status.type('info');
        status.value(1);

        status.save();
        Notifications.status.changed.dispatch();
    };

    self._removeStatus = function(coreKey) {
        var status = PersistenceService.findByPredicates(Status,
            [new KeyValuePredicate('characterId', coreKey),
            new KeyValuePredicate('identifier', self.statusIdentifier)])[0];
        if (status) {
            status.delete();
            Notifications.status.changed.dispatch();
        }
    };
}

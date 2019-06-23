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

    self.init = function() {
        Notifications.otherstats.changed.add(self.dataHasChanged);
        Notifications.coreManager.changed.add(self.load);
        self.load();
    };

    self.load = async () => {
        var key = CoreManager.activeCore().uuid();
        var otherStatsResponse = await OtherStats.ps.read({uuid: key});
        let otherStats = otherStatsResponse.object;
        if (!otherStats.inspiration()) {
            self._removeStatus();
        } else {
            self._updateStatus();
        }
    };
    /**
     * This method generates and persists a status that reflects
     * the character's encumbrance.
     */
    self.dataHasChanged = (otherStats) => {
        if (!otherStats) { return; }
        if (!otherStats.inspiration()) {
            self._removeStatus();
        } else {
            self._updateStatus();
        }
    };

    /* Private Methods */

    self._updateStatus = function() {
        var key = CoreManager.activeCore().uuid();

        var status = PersistenceService.findByPredicates(Status,
            [new KeyValuePredicate('characterId', key),
            new KeyValuePredicate('identifier', self.statusIdentifier)])[0];

        if (!status) {
            status = new Status();
            status.characterId(key);
            status.identifier(self.statusIdentifier);
        }

        status.name('inspired');
        status.type('info');
        status.value(1);

        status.save();
        Notifications.status.changed.dispatch();
    };

    self._removeStatus = function() {
        var key = CoreManager.activeCore().uuid();
        var status = PersistenceService.findByPredicates(Status,
            [new KeyValuePredicate('characterId', key),
            new KeyValuePredicate('identifier', self.statusIdentifier)])[0];
        if (status) {
            status.delete();
            Notifications.status.changed.dispatch();
        }
    };
}

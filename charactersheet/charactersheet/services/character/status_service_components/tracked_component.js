import { CharacterManager, Notifications } from 'charactersheet/utilities';
import { KeyValuePredicate, SharedServiceManager } from 'charactersheet/services/common';
import { Status, StatusWeightPair } from 'charactersheet/models';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { Tracked } from 'charactersheet/models';
import { getTrackedTypeEnum } from 'charactersheet/models/common/status_weight_pair';


/**
 * A Status Service Component that calculates the player's tracked ability potential.
 * Each tracked ability is weighed equally, as there is no way to programmatically determine
 * a tracked abilities' value.
 */

export function TrackedStatusServiceComponent() {
    var self = this;

    self.statusIdentifier = 'Status.Tracked';

    self.init = function() {
        Notifications.tracked.changed.add(self.dataHasChanged);
        Notifications.events.shortRest.add(self.dataHasChanged);
        Notifications.events.longRest.add(self.dataHasChanged);
        Notifications.feat.changed.add(self.dataHasChanged);
        Notifications.trait.changed.add(self.dataHasChanged);
        Notifications.feature.changed.add(self.dataHasChanged);
        self.dataHasChanged();
    };

    /**
     * This method determines wether to update or remove the Feature status
     * component from the player's status line.
     */
    self.dataHasChanged = function() {
        var key = CharacterManager.activeCharacter().key();
        var trackedAbilities = PersistenceService.findBy(Tracked, 'characterId', key);

        if (!trackedAbilities) { return; }

        if (trackedAbilities.length > 0) {
            self._updateStatus();
        } else {
            self._removeStatus();
        }
    };

    /* Private Methods */

    self._updateStatus = function() {
        var key = CharacterManager.activeCharacter().key();
        var trackedAbilities = PersistenceService.findBy(Tracked, 'characterId', key);
        var valueWeightPairs = [];

        var status = PersistenceService.findByPredicates(Status,
            [new KeyValuePredicate('characterId', key),
            new KeyValuePredicate('identifier', self.statusIdentifier)])[0];
        if (!status) {
            status = new Status();
            status.characterId(key);
            status.identifier(self.statusIdentifier);
        }

        // Each tracked ability is weighted equally.
        var featureWeight = 1 / trackedAbilities.length;
        trackedAbilities.forEach(function(trackedAbility, i, _) {
            var maxUses = trackedAbility.maxUses() ? trackedAbility.maxUses() : 0;
            var used = trackedAbility.used() ? trackedAbility.used() : 0;
            var trackedValue = maxUses ? (maxUses - used) / maxUses : 0;
            valueWeightPairs.push(new StatusWeightPair(trackedValue, featureWeight));
        });

        var weightedTotal = StatusWeightPair.processStatusWeights(valueWeightPairs);
        var phrase = StatusWeightPair.determinePhraseAndColor(getTrackedTypeEnum(), weightedTotal);

        status.name(phrase.status);
        status.type(phrase.color);
        status.value(weightedTotal);

        status.save();
        Notifications.status.changed.dispatch();
        Notifications.status.tracked.changed.dispatch();
    };

    self._removeStatus = function() {
        var key = CharacterManager.activeCharacter().key();
        var status = PersistenceService.findByPredicates(Status,
            [new KeyValuePredicate('characterId', key),
            new KeyValuePredicate('identifier', self.statusIdentifier)])[0];
        if (status) {
            status.delete();
            Notifications.status.changed.dispatch();
            Notifications.status.tracked.changed.dispatch();
        }
    };
}

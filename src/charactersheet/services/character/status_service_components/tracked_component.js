import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import {
    Feat,
    Feature,
    Trait
} from 'charactersheet/models/character';
import { KeyValuePredicate } from 'charactersheet/services/common';
import {
    Status,
    StatusWeightPair
} from 'charactersheet/models';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
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
     * This method determines wether to update or remove the Tracked status
     * component from the player's status line.
     */
    self.dataHasChanged = async () => {
        var key = CoreManager.activeCore().uuid();
        var trackables = [];

        // Fetch trackable objects
        var features = await Feature.ps.list({coreUuid: key});
        var feats = await Feat.ps.list({coreUuid: key});
        var traits = await Trait.ps.list({coreUuid: key});

        if (features.objects) {
            features.objects.forEach((e) => {
                if (e.tracked()) {
                    trackables.push(e.tracked());
                }
            });
        }

        if (feats.objects) {
            feats.objects.forEach((e) => {
                if (e.tracked()) {
                    trackables.push(e.tracked());
                }
            });
        }

        if (traits.objects) {
            traits.objects.forEach((e) => {
                if (e.tracked()) {
                    trackables.push(e.tracked());
                }
            });
        }

        if (!trackables || trackables.length > 0) {
            self._updateStatus(trackables);
        } else {
            self._removeStatus();
        }
    };

    /* Private Methods */

    self._updateStatus = function(trackables) {
        var key = CoreManager.activeCore().uuid();
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
        var featureWeight = 1 / trackables.length;
        trackables.forEach(function(tracked) {
            var maxUses = tracked.max() ? tracked.max() : 0;
            var used = tracked.used() ? tracked.used() : 0;
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
        var key = CoreManager.activeCore().uuid();
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

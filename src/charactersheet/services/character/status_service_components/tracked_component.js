import {
    CoreManager,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import {
    Feat,
    Feature,
    Trait
} from 'charactersheet/models/character';
import {
    Status,
    StatusWeightPair
} from 'charactersheet/models';
import { find, flatMap } from 'lodash';
import { KeyValuePredicate } from 'charactersheet/services/common';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { getTrackedTypeEnum } from 'charactersheet/models/common/status_weight_pair';

import ko from 'knockout';
/**
 * A Status Service Component that calculates the player's tracked ability potential.
 * Each tracked ability is weighed equally, as there is no way to programmatically determine
 * a tracked abilities' value.
 */

export function TrackedStatusServiceComponent() {
    var self = this;

    self.statusIdentifier = 'Status.Tracked';


    self.init = function() {
        self.trackedItems = ko.observableArray([]);

        Notifications.feature.added.add(self.itemAdded);
        Notifications.feature.changed.add(self.itemChanged);
        Notifications.feature.deleted.add(self.itemDeleted);

        Notifications.feat.added.add(self.itemAdded);
        Notifications.feat.changed.add(self.itemChanged);
        Notifications.feat.deleted.add(self.itemDeleted);

        Notifications.trait.added.add(self.itemAdded);
        Notifications.trait.changed.add(self.itemChanged);
        Notifications.trait.deleted.add(self.itemDeleted);
        self.load();
    };


    self.load = async () => {
        var key = CoreManager.activeCore().uuid();

        const trackedModelTypes = [Feature, Feat, Trait];
        const fetchTrackedEntities = trackedModelTypes.map(
          (type) => type.ps.list({ coreUuid: key }));
        const responseList = await Promise.all(fetchTrackedEntities);
        const tracked = flatMap(responseList, (response) => response.objects).filter(self.showTracked);
        self.trackedItems(tracked);

        if (!self.trackedItems() || self.trackedItems().length > 0) {
            self._updateStatus();
        } else {
            self._removeStatus();
        }
    };

    self.itemAdded = function (item) {
        if (item && item.isTracked()) {
            const tracked = find(self.trackedItems(), (trackable)=> {
                return ko.utils.unwrapObservable(item).uuid() === ko.utils.unwrapObservable(trackable).uuid();
            });
            if (!tracked) {
                self.trackedItems.push(item);
                if (!self.trackedItems() || self.trackedItems().length > 0) {
                    self._updateStatus();
                } else {
                    self._removeStatus();
                }
            }
        }
    };

    self.itemDeleted = function (item) {
        if (item) {
            self.trackedItems.remove(
              (entry) => {
                  return ko.utils.unwrapObservable(entry.uuid) === ko.utils.unwrapObservable(item.uuid);
              });
            if (!self.trackedItems() || self.trackedItems().length > 0) {
                self._updateStatus();
            } else {
                self._removeStatus();
            }
        }
    };

    self.itemChanged = function (item) {
        if (item) {
            const tracked = find(self.trackedItems(), (trackable)=> {
                return ko.utils.unwrapObservable(item).uuid() === ko.utils.unwrapObservable(trackable).uuid();
            });
            let changed = false;
            if (tracked) {
                if (!ko.utils.unwrapObservable(item).isTracked()) {
                    // Used to be tracked, is no longer tracked;
                    self.trackedItems.remove(
                      (entry) => {
                          return ko.utils.unwrapObservable(entry.uuid) === ko.utils.unwrapObservable(item.uuid);
                      });
                    changed = true;
                } else {
                    // Used to be tracked, tracked properties changed;
                    Utility.array.updateElement(self.trackedItems(), item, ko.utils.unwrapObservable(item.uuid));
                    changed = true;
                }
            } else if (ko.utils.unwrapObservable(item).isTracked()) {
                // Was not tracked, is now tracked;
                self.trackedItems.push(item);
                changed = true;
            }
            if (changed) {
                if (!self.trackedItems() || self.trackedItems().length > 0) {
                    self._updateStatus();
                } else {
                    self._removeStatus();
                }
            }
        }
    };

    self.showTracked = (entity) => {
        return !!ko.utils.unwrapObservable(entity.isTracked);
    };
    /**
     * This method determines wether to update or remove the Tracked status
     * component from the player's status line.
     */


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

        // Each tracked ability is weighted equally.
        var featureWeight = 1 / self.trackedItems().length;
        const valueWeightPairs = self.trackedItems().map(function(trackableItem) {
            const tracked = ko.utils.unwrapObservable(trackableItem).tracked();
            var maxUses = tracked.max() ? tracked.max() : 0;
            var used = tracked.used() ? tracked.used() : 0;
            var trackedValue = maxUses ? (maxUses - used) / maxUses : 0;
            return new StatusWeightPair(trackedValue, featureWeight);
        });

        var weightedTotal = StatusWeightPair.processStatusWeights(valueWeightPairs).toFixed(2);
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

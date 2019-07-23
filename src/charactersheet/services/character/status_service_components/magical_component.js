import {
    CoreManager,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { SharedServiceManager } from 'charactersheet/services/common/shared_service_manager';
import { SpellSlot } from 'charactersheet/models/character/spell_slot';
import { Status } from 'charactersheet/models/common/status';
import { StatusWeightPair } from 'charactersheet/models/common/status_weight_pair';
import { getMagicTypeEnum } from 'charactersheet/models/common/status_weight_pair';

import ko from 'knockout';

/**
 * A Status Service Component that calculates the player's Magical potential.
 * Each spell slot is weighed differently. Currently, the formula is linear.
 * `Y=1.5x + 1` where x is the spell slot level.
 */

export function MagicalStatusServiceComponent() {
    var self = this;

    self.statusIdentifier = 'Status.Magical';
    self.spellSlots = ko.observableArray([]);

    self.init = async function() {
        await self.load();
        self.setUpSubscriptions();
    };

    self.setUpSubscriptions = () => {
        Notifications.spellslot.added.add(self.spellSlotAdded);
        Notifications.spellslot.changed.add(self.spellSlotChanged);
        Notifications.spellslot.deleted.add(self.spellSlotDeleted);
        Notifications.coreManager.changing.add(self.reload);
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
        self.spellSlots([]);
        const response = await SpellSlot.ps.list({coreUuid: activeCore.uuid()});
        self.spellSlots(response.objects);
        if (!self.spellSlots().length) {
            return;
        }
        self.dataHasChanged(activeCore.uuid());
    };

    self.reload = (oldCore, newCore) => {
        self.spellSlots([]);
        self._removeStatus(oldCore);
        self.load(newCore);
    };

    self.spellSlotAdded = function (spellSlot) {
        if (spellSlot) {
            const existingSpellSlot = find(self.spellSlots(), (item)=> {
                return ko.utils.unwrapObservable(spellSlot).uuid() === ko.utils.unwrapObservable(item).uuid();
            });
            if (!existingSpellSlot) {
                self.spellSlots.push(spellSlot);
                self.dataHasChanged(spellSlot.coreUuid());
            } else {
                self.spellSlotChanged(spellSlot);
            }
        }
    };

    self.spellSlotDeleted = function (spellSlot) {
        if (spellSlot) {
            self.spellSlots.remove(
              (entry) => {
                  return ko.utils.unwrapObservable(entry.uuid) === ko.utils.unwrapObservable(spellSlot.uuid);
              });
            self.dataHasChanged(spellSlot.coreUuid());
        }
    };

    self.spellSlotChanged = function (item) {
        if (item) {
            Utility.array.updateElement(self.spellSlots(), item, ko.utils.unwrapObservable(item.uuid));
            self.dataHasChanged(item.coreUuid());
        }
    };

    /**
     * This method determines wether to update or remove the Magical status
     * component from the player's status line.
     */
    self.dataHasChanged = (coreKey) => {
        if (self.spellSlots().length > 0) {
            self._updateStatus(coreKey);
        } else {
            self._removeStatus(coreKey);
        }
    };

    /* Private Methods */

    self._updateStatus = function(coreKey) {
        var valueWeightPairs = [];

        var status = PersistenceService.findByPredicates(Status,
            [new KeyValuePredicate('characterId', coreKey),
            new KeyValuePredicate('identifier', self.statusIdentifier)])[0];

        if (!status) {
            status = new Status();
            status.characterId(coreKey);
            status.identifier(self.statusIdentifier);
        }

        valueWeightPairs = self.prepareValueWeightPairs(self.spellSlots());
        var weightedTotal = StatusWeightPair.processStatusWeights(valueWeightPairs);
        var phrase = StatusWeightPair.determinePhraseAndColor(getMagicTypeEnum(), weightedTotal);

        status.name(phrase.status);
        status.type(phrase.color);
        status.value(weightedTotal);

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

    /**
     * Creates the valueWeightPair array in preperation of further processing.
     */
    self.prepareValueWeightPairs = function(spellSlots) {
        var valueWeightPairs = [];

        spellSlots.forEach(function(slot, i, _) {
            if (!slot.level()) { return; }
            var level = slot.level();
            var maxUses = slot.max() ? slot.max() : 0;
            var used = slot.used() ? slot.used() : 0;
            var value = maxUses ? (maxUses - used) / maxUses : 0;
            var weight = self._getSpellSlotWeight(level);

            valueWeightPairs.push(new StatusWeightPair(value, weight));
        });

        return self._normalizeWeights(valueWeightPairs);
    };

    /**
     * Linear formula for determining spell slot weight.
     */
    self._getSpellSlotWeight = function(level) {
        var delta = 1.5;
        return 1 + delta * level;
    };

    /**
     * Normalizes the sum of the calculated weights.
     * Calculated weight / sum of calculated weights
     */
    self._normalizeWeights = function(valueWeightPairs) {
        var totalWeight = 0;
        valueWeightPairs.forEach(function(pair, idx, _) {
            totalWeight += pair.weight;
        });
        valueWeightPairs.forEach(function(pair, idx, _) {
            pair.weight = pair.weight / totalWeight;
        });

        return valueWeightPairs;
    };
}

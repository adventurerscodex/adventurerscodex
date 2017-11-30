import {
    CharacterManager,
    Notifications
} from 'charactersheet/utilities';
import {
    KeyValuePredicate,
    SharedServiceManager
} from 'charactersheet/services/common';
import {
    Status,
    StatusWeightPair
} from 'charactersheet/models';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { Slot } from 'charactersheet/models';
import { getMagicTypeEnum } from 'charactersheet/models/common/status_weight_pair';


/**
 * A Status Service Component that calculates the player's Magical potential.
 * Each spell slot is weighed differently. Currently, the formula is linear.
 * `Y=1.5x + 1` where x is the spell slot level.
 */

export function MagicalStatusServiceComponent() {
    var self = this;

    self.statusIdentifier = 'Status.Magical';

    self.init = function() {
        Notifications.spellSlots.changed.add(self.dataHasChanged);
        self.dataHasChanged();
    };

    /**
     * This method determines wether to update or remove the Magical status
     * component from the player's status line.
     */
    self.dataHasChanged = function() {
        var key = CharacterManager.activeCharacter().key();
        var spellSlots = PersistenceService.findBy(Slot, 'characterId', key);

        if (!spellSlots) { return; }

        if (spellSlots.length > 0) {
            self._updateStatus();
        } else {
            self._removeStatus();
        }
    };

    /* Private Methods */

    self._updateStatus = function() {
        var key = CharacterManager.activeCharacter().key();
        var spellSlots = PersistenceService.findBy(Slot, 'characterId', key);
        var valueWeightPairs = [];

        var status = PersistenceService.findByPredicates(Status,
            [new KeyValuePredicate('characterId', key),
            new KeyValuePredicate('identifier', self.statusIdentifier)])[0];
        if (!status) {
            status = new Status();
            status.characterId(key);
            status.identifier(self.statusIdentifier);
        }

        valueWeightPairs = self.prepareValueWeightPairs(spellSlots);

        var weightedTotal = StatusWeightPair.processStatusWeights(valueWeightPairs);
        var phrase = StatusWeightPair.determinePhraseAndColor(getMagicTypeEnum(), weightedTotal);

        status.name(phrase.status);
        status.type(phrase.color);
        status.value(weightedTotal);

        status.save();
        Notifications.status.changed.dispatch();
        Notifications.status.magic.changed.dispatch();
    };

    self._removeStatus = function() {
        var key = CharacterManager.activeCharacter().key();
        var status = PersistenceService.findByPredicates(Status,
            [new KeyValuePredicate('characterId', key),
            new KeyValuePredicate('identifier', self.statusIdentifier)])[0];
        if (status) {
            status.delete();
            Notifications.status.changed.dispatch();
            Notifications.status.magic.changed.dispatch();
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
            var maxUses = slot.maxSpellSlots() ? slot.maxSpellSlots() : 0;
            var used = slot.usedSpellSlots() ? slot.usedSpellSlots() : 0;
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

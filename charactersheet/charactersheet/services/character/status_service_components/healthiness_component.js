import { CharacterManager, Notifications } from 'charactersheet/utilities'
import { Health, HitDice } from 'charactersheet/models'
import { KeyValuePredicate, PersistenceService, SharedServiceManager } from 'charactersheet/services/common'
import { Status,
    StatusWeightPair } from 'charactersheet/models'
import { getHealthTypeEnum } from 'charactersheet/models/common/status_weight_pair'


/**
 * A Status Service Component that calculates the player's overall healthiness.
 * Hit Dice will have a weight of 30% and Hit Points will have a weight 70%.
 */

export function HealthinessStatusServiceComponent() {
    var self = this;

    self.statusIdentifier = 'Status.Healthiness';
    self.HEALTH_WEIGHT = 0.70;
    self.HIT_DICE_WEIGHT = 0.30;

    self.init = function() {
        Notifications.health.changed.add(self.dataHasChanged);
        Notifications.hitDice.changed.add(self.dataHasChanged);
        self.dataHasChanged();
    };

    /**
     * This method determines wether to update or remove the Healthiness status
     * component from the player's status line.
     */
    self.dataHasChanged = function() {
        var key = CharacterManager.activeCharacter().key();
        var health = PersistenceService.findFirstBy(Health, 'characterId', key);
        var hitDice = PersistenceService.findBy(HitDice, 'characterId', key);

        if (!health && !hitDice) { return; }

        if (health || hitDice) {
            self._updateStatus();
        } else {
            self._removeStatus();
        }
    };

    /* Private Methods */

    self._updateStatus = function() {
        var key = CharacterManager.activeCharacter().key();
        var health = PersistenceService.findFirstBy(Health, 'characterId', key);
        var hitDiceList = PersistenceService.findBy(HitDice, 'characterId', key);
        var valueWeightPairs = [];

        var status = PersistenceService.findByPredicates(Status,
            [new KeyValuePredicate('characterId', key),
            new KeyValuePredicate('identifier', self.statusIdentifier)])[0];
        if (!status) {
            status = new Status();
            status.characterId(key);
            status.identifier(self.statusIdentifier);
        }

        if (health) {
            valueWeightPairs.push(self.prepareHealthValueWeightPairs(health));
        }

        if (hitDiceList.length > 0) {
            valueWeightPairs.push(self.prepareHitDiceValueWeightPairs(hitDiceList));
        }

        var weightedTotal = StatusWeightPair.processStatusWeights(valueWeightPairs);
        var phrase = StatusWeightPair.determinePhraseAndColor(getHealthTypeEnum(), weightedTotal);

        status.name(phrase.status);
        status.type(phrase.color);
        status.value(weightedTotal);

        status.save();
        Notifications.status.changed.dispatch();
        Notifications.status.healthiness.changed.dispatch();
    };

    self._removeStatus = function() {
        var key = CharacterManager.activeCharacter().key();
        var status = PersistenceService.findByPredicates(Status,
            [new KeyValuePredicate('characterId', key),
            new KeyValuePredicate('identifier', self.statusIdentifier)])[0];
        if (status) {
            status.delete();
            Notifications.status.changed.dispatch();
            Notifications.status.healthiness.changed.dispatch();
        }
    };

    /**
     * Returns a decimal that represents the total Hit Points a player has.
     *
     * @param health  active character's Health model
     * @return StatusWeightPair
     */
    self.prepareHealthValueWeightPairs = function(health) {
        var value = health.hitpoints() / health.totalHitpoints();

        return new StatusWeightPair(value, self.HEALTH_WEIGHT);
    };

    /**
     * Returns a decimal that represents the total amount of un-used Hit Dice a player has.
     *
     * @param hitDiceList  active character's list of HitDice models
     * @return StatusWeightPair
     */
    self.prepareHitDiceValueWeightPairs = function(hitDiceList) {
        var avaialableHitDice = 0;
        hitDiceList.forEach(function(hitDice, i, _) {
            if (!hitDice.hitDiceUsed()) {
                avaialableHitDice++;
            }
        });
        var value = avaialableHitDice / hitDiceList.length;

        return new StatusWeightPair(value, self.HIT_DICE_WEIGHT);
    };
}

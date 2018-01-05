import { CharacterManager, Notifications } from 'charactersheet/utilities';
import { DeathSave } from 'charactersheet/models/character/death_save';
import { Health } from 'charactersheet/models/character/health';
import { HitDice } from 'charactersheet/models/character/hit_dice';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { SharedServiceManager } from 'charactersheet/services/common/shared_service_manager';
import { Status } from 'charactersheet/models/common/status';
import { StatusWeightPair } from 'charactersheet/models/common/status_weight_pair';
import { getHealthTypeEnum } from 'charactersheet/models/common/status_weight_pair';


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
        Notifications.stats.deathSaves.fail.changed.add(self._initDeathSavesFail);
        Notifications.stats.deathSaves.notFail.changed.add(self._initDeathSavesNotFail);
        Notifications.stats.deathSaves.success.changed.add(self._initDeathSavesSuccess);
        Notifications.stats.deathSaves.notSuccess.changed.add(self._initDeathSavesNotSuccess);
        self.dataHasChanged();
    };

    /**
     * This method determines whether to update or remove the Healthiness status
     * component from the player's status line.
     */
    self.dataHasChanged = function() {
        var key = CharacterManager.activeCharacter().key();
        var health = PersistenceService.findFirstBy(Health, 'characterId', key);
        var hitDice = PersistenceService.findBy(HitDice, 'characterId', key);
        var deathSaves = PersistenceService.findBy(DeathSave, 'characterId', key);

        var deathSavesDidFail = false;
        var deathSavesDidSucceed = false;

        if (!health && !hitDice) { return; }

        if (health || hitDice) {
            var deathSaveSuccesses = 0;
            var deathSaveFailures = 0;

            if (deathSaves.length > 0) {
                for (var i=0; i<3; i++) {
                    if (deathSaves[i] !== undefined && deathSaves[i].deathSaveSuccess()) {
                        deathSaveSuccesses++;
                    }
                }
                for (var j=3; j<6; j++) {
                    if (deathSaves[j] !== undefined && deathSaves[j].deathSaveFailure()) {
                        deathSaveFailures++;
                    }
                }
                if (deathSaveSuccesses === 3) {
                    deathSavesDidSucceed = true;
                }
                if (deathSaveFailures === 3) {
                    deathSavesDidFail = true;
                }
            }
        }
        self._updateStatus(deathSavesDidFail, deathSavesDidSucceed);
    };

    /* Private Methods */

    // 3 death saves failed
    self._initDeathSavesFail = function() {
        self._updateStatus(true, false);
    };

    // _alertPlayerHasDied was called and all 3 death saves did not fail
    self._initDeathSavesNotFail = function() {
        self._updateStatus(false, false);
    };

    // 3 death saves succeeded
    self._initDeathSavesSuccess = function() {
        self._updateStatus(false, true);
    };

    // _alertPlayerIsStable was called and all 3 death saves did not succeed
    self._initDeathSavesNotSuccess = function() {
        self._updateStatus(false, false);
    };

    self._updateStatus = function(deathSavesDidFail,
                                  deathSavesDidSucceed) {
        var key = CharacterManager.activeCharacter().key();
        var health = PersistenceService.findFirstBy(Health, 'characterId', key);
        var hitDiceList = PersistenceService.findBy(HitDice, 'characterId', key);

        var status = PersistenceService.findByPredicates(Status,
            [new KeyValuePredicate('characterId', key),
            new KeyValuePredicate('identifier', self.statusIdentifier)])[0];
        if (!status) {
            status = new Status();
            status.characterId(key);
            status.identifier(self.statusIdentifier);
        }

        var weightedTotal = self._getWeightedTotal(health,
                                                   hitDiceList,
                                                   deathSavesDidFail,
                                                   deathSavesDidSucceed);

        var phrase = StatusWeightPair.determinePhraseAndColor(getHealthTypeEnum(), weightedTotal);

        status.name(phrase.status);
        status.type(phrase.color);
        status.value(weightedTotal);

        status.save();
        Notifications.status.changed.dispatch();
        Notifications.status.healthiness.changed.dispatch();
    };

    /**
     * This method calculates the weighted values and performs special handling
     * for dead, unconscious and stable, and unconscious states.
     */
    self._getWeightedTotal = function(health,
                                      hitDiceList,
                                      deathSavesDidFail,
                                      deathSavesDidSucceed) {

        var valueWeightPairs = [];

        // Character is in a state of no health after character creation
        if (!health) {
            return 1;
        }

        // Character is dead
        if (health.hitpoints() === 0 && deathSavesDidFail) {
            return -2;
        }

        // Character is unconscious and stable
        if (health.hitpoints() === 0 && deathSavesDidSucceed) {
            return -1;
        }

        // Character is unconscious
        if (health.hitpoints() === 0) {
            return 0.0;
        }

        if (health) {
            valueWeightPairs.push(self.prepareHealthValueWeightPairs(health));
        }

        if (hitDiceList.length > 0) {
            valueWeightPairs.push(
                self.prepareHitDiceValueWeightPairs(hitDiceList)
            );
        }

        var weightedTotal = StatusWeightPair.processStatusWeights(valueWeightPairs);

        return weightedTotal;
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
        var availableHitDice = 0;
        hitDiceList.forEach(function(hitDice, i, _) {
            if (!hitDice.hitDiceUsed()) {
                availableHitDice++;
            }
        });
        var value = availableHitDice / hitDiceList.length;

        return new StatusWeightPair(value, self.HIT_DICE_WEIGHT);
    };
}

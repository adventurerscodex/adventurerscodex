'use strict';

/**
 * A Status Service Component that calculates the player's overall healthiness. Hit Dice will have a weight of 30% and Health will have a weight 70%.
 */

function HealthinessStatusServiceComponent() {
    var self = this;

    self.statusIdentifier = 'Status.Healthiness';
    self.HEALTH_WEIGHT = 0.70;
    self.HIT_DICE_WEIGHT = 0.30;

    self.init = function() {
        Notifications.stats.changed.add(self.dataHasChanged);
        self.dataHasChanged();
    };

    /**
     * This method generates and persists a status that reflects
     * the character's encumbrance.
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

    /**
     * Processes array of StatusWeightPairs and return their calculated sums.
     *
     * @param valueWeightPairs  Contains a list of StatusWeightPair objects
     * @return totalStatusWeight  Decimal representation of StatusWeightPair list
     */
    self.processStatusWeights = function(valueWeightPairs) {
        var totalStatusWeight = 0;

        valueWeightPairs.forEach(function(pair, i, _) {
            totalStatusWeight += pair.value * pair.weight;
        });

        return totalStatusWeight;
    };

    /**
     * Returns a decimal that represents the total health a player has.
     *
     * @param health  active character's Health model
     * @return StatusWeightPair
     */
    self.prepareHealthValueWeightPairs = function(health) {
        var value = health.hitpoints() / health.totalHitpoints();

        return new StatusWeightPair(value, self.HEALTH_WEIGHT);
    };

    /**
     * Returns a decimal that represents the total amount of un-used hit dice a player has.
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

        var weightedTotal = self.processStatusWeights(valueWeightPairs);

        status.name((weightedTotal));
        status.type('info');

        status.save();
        Notifications.status.changed.dispatch();
    };

    self._removeStatus = function() {
        var key = CharacterManager.activeCharacter().key();
        var status = PersistenceService.findByPredicates(Status,
            [new KeyValuePredicate('characterId', key),
            new KeyValuePredicate('identifier', self.statusIdentifier)])[0];
        if (status) {
            status.delete();
            Notifications.status.changed.dispatch();
        }
    };
}

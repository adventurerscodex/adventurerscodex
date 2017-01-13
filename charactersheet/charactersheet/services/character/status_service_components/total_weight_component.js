'use strict';

/**
 * A Status Service Component that tracks the total weight that a character
 * is carrying, and any modifiers that are applied due to this weight.
 */
function TotalWeightStatusServiceComponent() {
    var self = this;

    self.statusIdentifier = 'Status.Encumbrance';

    self.init = function() {
        Notifications.profile.changed.add(self.dataHasChanged);
        Notifications.armor.changed.add(self.dataHasChanged);
        Notifications.weapon.changed.add(self.dataHasChanged);
        Notifications.item.changed.add(self.dataHasChanged);
        Notifications.magicItem.changed.add(self.dataHasChanged);
        Notifications.treasure.changed.add(self.dataHasChanged);
        self.dataHasChanged();  //Calculate the first one.
    };

    /**
     * This method generates and persists a status that reflects
     * the character's encumbrance.
     */
    self.dataHasChanged = function() {
        var key = CharacterManager.activeCharacter().key();
        var scores = AbilityScores.findBy(key)[0];
        if (!scores || !scores.str()) {
            self._removeStatus();
        } else {
            self._updateStatus();
        }
    };

    self.getDescription = function(weight) {
        if (weight === 0) {
            return 'carrying nothing';
        }
        return 'carrying ~' + String(weight) + 'lbs';
    };

    self.getType = function(strength, weight) {
        if (weight === 0) {
            return 'default';
        } else if (weight < strength * 5) {
            return 'info';
        } else if (weight < strength * 10) {
            return 'warning';
        } else {
            return 'danger';
        }
    };

    /* Private Methods */

    self._updateStatus = function() {
        var key = CharacterManager.activeCharacter().key();
        var scores = AbilityScores.findBy(key)[0];

        var weight = 0;

        weight += self._getWeightFor(Armor, 'armorWeight');
        weight += self._getWeightFor(Weapon, 'totalWeight');
        weight += self._getWeightFor(Item, 'totalWeight');
        weight += self._getWeightFor(MagicItem, 'magicItemWeight');
        weight += self._getWeightFor(Treasure, 'totalWeight');

        var status = Status.findByKeyAndIdentifier(key, self.statusIdentifier)[0];
        if (!status) {
            status = new Status();
            status.characterId(key);
            status.identifier(self.statusIdentifier);
        }

        status.name(self.getDescription(weight));
        status.type(self.getType(scores.str(), weight));

        status.save();
        Notifications.status.changed.dispatch();
    };

    self._removeStatus = function() {
        var key = CharacterManager.activeCharacter().key();
        var status = Status.findByKeyAndIdentifier(key, self.statusIdentifier)[0];
        if (status) {
            status.delete();
            Notifications.status.changed.dispatch();
        }
    };

    self._getWeightFor = function(model, property)  {
        var weight = 0;
        var key = CharacterManager.activeCharacter().key();
        PersistenceService.findBy(model, 'characterId', key).forEach(function(instance, idx, _) {
            var weightValue = parseFloat(ko.unwrap(instance[property]));
            if (weightValue) {
                weight += weightValue;
            }
        });
        return weight;
    };

}

'use strict';

/**
 * A Status Service Component that tracks the total weight that a character
 * is carrying, and any modifiers that are applied due to this weight.
 */
function TotalWeightStatusServiceComponent() {
    var self = this;

    self.statusIdentifier = 'Status.Encumbrance';
    self.carryCapacity = Fixtures.carryCapacity;

    self.init = function() {
        Notifications.profile.changed.add(self.dataHasChanged);
        Notifications.armor.changed.add(self.dataHasChanged);
        Notifications.weapon.changed.add(self.dataHasChanged);
        Notifications.item.changed.add(self.dataHasChanged);
        self.dataHasChanged();  //Calculate the first one.
    };

    /**
     * This method generates and persists a status that reflects
     * the character's encumbrance.
     */
    self.dataHasChanged = function() {
        var key = CharacterManager.activeCharacter().key();
        var scores = AbilityScores.findBy(key)[0];
        if (!scores || !scores.str()) { return }

        var carryCapacity = self.carryCapacity[scores.str()];

        var weight = 0;
        Armor.findAllBy(key).forEach(function(e, i, _) {
            weight += parseInt(e.armorWeight());
        });
        Weapon.findAllBy(key).forEach(function(e, i, _) {
            weight += parseInt(e.totalWeight());
        });
        Item.findAllBy(key).forEach(function(e, i, _) {
            weight += parseInt(e.totalWeight());
        });

        // Skip the rest if there's nothing to say.
        if (weight === 0) { return }

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

    self.getDescription = function(weight) {
        return 'carrying ~' + String(weight) + 'lbs';
    };

    self.getType = function(strength, weight) {
        var carryCapacity = self.carryCapacity[strength];
        if (weight <= carryCapacity.light) {
            return 'info';
        } else if (weight <= carryCapacity.medium) {
            return 'warning';
        } else {
            return 'danger';
        }

    };
}

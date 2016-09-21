'use strict';

/**
 * A Status Service Component that tracks the total weight that a character
 * is carrying, and any modifiers that are applied due to this weight.
 */
function TotalWeightStatusServiceComponent() {
    var self = this;

    self.statusIdentifier = 'Status.Encumbrance';
    self.statusValues = {
        warning: { name: 'encumbered', type: 'warning' },
        danger: { name: 'really encumbered', type: 'danger' }
    }
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
            weight += e.armorWeight();
        });
        Weapon.findAllBy(key).forEach(function(e, i, _) {
            weight += e.totalWeight();
        });
        Item.findAllBy(key).forEach(function(e, i, _) {
            weight += e.totalWeight();
        });

        var status = Status.findByKeyAndIdentifier(key, self.statusIdentifier)[0];
        if (!status) {
            status = new Status();
            status.characterId(key);
            status.identifier(self.statusIdentifier);
            status.save();
        }

        if (weight <= carryCapacity.light) {
            status.delete();
        } else if (weight <= carryCapacity.medium) {
            status.name(self.statusValues.warning.name);
            status.type(self.statusValues.warning.type);
            status.save();
        } else {
            status.name(self.statusValues.danger.name);
            status.type(self.statusValues.danger.type);
            status.save();
        }
        Notifications.status.changed.dispatch();
    };
}

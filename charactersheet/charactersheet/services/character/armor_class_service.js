'use strict';

var ArmorClassService = new SharedServiceManager(_ArmorClassService, {});

function _ArmorClassService(configuration) {
    var self = this;

    self.armorClass = ko.observable();

    self.init = function() {
        Notifications.armor.changed.add(self.dataHasChanged);
        Notifications.abilityScores.changed.add(self.dataHasChanged);
        Notifications.stats.changed.add(self.dataHasChanged);

        // Kick it off the first time.
        self.dataHasChanged();
    };

    self.dataHasChanged = function() {
        var calculatedAC = self.baseArmorClass();
        var dexBonus = self.dexBonus();
        var armorMagicalModifier = self.equippedArmorMagicalModifier();
        var shieldMagicalModifier = self.equippedShieldMagicalModifier();
        var shieldBonus = self.getEquippedShieldBonus();
        var armorClassModifier = self.armorClassModifier();

        // Always add this modifier.
        calculatedAC += armorClassModifier;
        calculatedAC += dexBonus;

        if (self.hasShield()) {
            calculatedAC += shieldMagicalModifier + shieldBonus;
        }

        if (self.hasArmor()) {
            calculatedAC += armorMagicalModifier;
        }

        // Set the value and let everyone know.
        self.armorClass(calculatedAC);
        Notifications.armorClass.changed.dispatch();
    };

    /* Public Methods */

    self.baseArmorClass = function() {
        var armorClass = 10,
            modifier = 0;

        var armor = self._getEquippedArmors();
        if (armor.length > 0) {
            var value = armor[0].armorClass();
            return parseInt(value) ? parseInt(value) : 0;
        }
        return armorClass;
    };

    self.equippedArmorMagicalModifier = function() {
        var armor = self._getEquippedArmors(),
            magicalModifier = 0;

        if (armor.length > 0) {
            var modifier = armor[0].armorMagicalModifier();
            magicalModifier = parseInt(modifier) ? parseInt(modifier) : 0;
        }
        return magicalModifier;
    };

    self.equippedShieldMagicalModifier = function() {
        var shields = self._getEquippedShields(),
            magicalModifier = 0;

        if (shields.length > 0) {
            var modifier = shields[0].armorMagicalModifier();
            magicalModifier = parseInt(modifier) ? parseInt(modifier) : 0;
        }

        return magicalModifier;
    };

    self.atLeastOneArmorEquipped = function() {
        return self._getEquippedArmors().length + self._getEquippedShields().length > 0;
    };

    self.dexBonus = function() {
        var score = 0,
            rawDexBonus = 0,
            characterId = CharacterManager.activeCharacter().key();

        try {
            var scores = PersistenceService.findFirstBy(AbilityScores, 'characterId', characterId);
            rawDexBonus = parseInt(scores.modifierFor('Dex')) ? parseInt(scores.modifierFor('Dex')) : 0;
        } catch(err) { /*Ignore*/ }

        var armor = self._getEquippedArmors()[0];
        if (armor.armorEquipped() === 'equipped') {
            if (armor.armorType() === 'Medium') {
                score += rawDexBonus >= 2 ? 2 : rawDexBonus;
            } else {
                score += rawDexBonus;
            }
        }
        return score;
    };

    self.armorClassModifier = function() {
        var key = CharacterManager.activeCharacter().key();
        var otherStats = PersistenceService.findFirstBy(OtherStats, 'characterId', key);

        return otherStats.armorClassModifier() ? parseInt(otherStats.armorClassModifier()) : 0;
    };

    self.getEquippedShieldBonus = function() {
        if (self.hasShield()) {
            var armorClass = self._getEquippedShields()[0].armorClass();
            return parseInt(armorClass) ? parseInt(armorClass) : 0;
        }
        return 0;
    };

    self.hasArmor = function() {
        var equippedArmors = self._getEquippedArmors();
        return equippedArmors.length > 0;
    };

    self.hasShield = function() {
        var equippedShield = self._getEquippedShields();
        return equippedShield.length > 0;
    };

    /* Private Methods */

    self._getEquippedArmors = function() {
        var characterId = CharacterManager.activeCharacter().key();
        var predicates = [
            new KeyValuePredicate('characterId', characterId),
            new KeyValuePredicate('armorEquipped', 'equipped'),
            new NotPredicate(new KeyValuePredicate('armorType', 'Shield'))
        ];

        return PersistenceService.findByPredicates(Armor, predicates);
    };

    self._getEquippedShields = function() {
        var characterId = CharacterManager.activeCharacter().key();
        var predicates = [
            new KeyValuePredicate('characterId', characterId),
            new KeyValuePredicate('armorEquipped', 'equipped'),
            new KeyValuePredicate('armorType', 'Shield')
        ];
        return PersistenceService.findByPredicates(Armor, predicates);
    };
}

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
        var shieldBonus = 2;
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
        var ac = 10;

        var characterId = CharacterManager.activeCharacter().key();
        var predicates = [
            new KeyValuePredicate('characterId', characterId),
            new KeyValuePredicate('armorEquipped', 'equipped'),
            new NotPredicate(new KeyValuePredicate('armorType', 'Shield'))
        ];

        var armor = PersistenceService.findByPredicates(Armor, predicates);

        if (armor.length > 0) {
            return parseInt(armor[0].armorClass().trim().split(/[^0-9]/)[0]);
        }
        return ac;
    };

    self.equippedArmorMagicalModifier = function() {
        var magicalModifier = 0;

        var characterId = CharacterManager.activeCharacter().key();
        var predicates = [
            new KeyValuePredicate('characterId', characterId),
            new KeyValuePredicate('armorEquipped', 'equipped'),
            new NotPredicate(new KeyValuePredicate('armorType', 'Shield'))
        ];

        var armor = PersistenceService.findByPredicates(Armor, predicates);

        if (armor.length > 0) {
            magicalModifier = parseInt(armor[0].armorMagicalModifier());
        }
        return magicalModifier;
    };

    self.equippedShieldMagicalModifier = function() {
        var magicalModifier = 0;

        var characterId = CharacterManager.activeCharacter().key();
        var predicates = [
            new KeyValuePredicate('characterId', characterId),
            new KeyValuePredicate('armorEquipped', 'equipped'),
            new KeyValuePredicate('armorType', 'Shield')
        ];

        var shields = PersistenceService.findByPredicates(Armor, predicates);

        if (shields.length > 0) {
            magicalModifier = parseInt(shields[0].armorMagicalModifier());
        }

        return magicalModifier;
    };

    self.atLeastOneArmorEquipped = function() {
        var characterId = CharacterManager.activeCharacter().key();
        var predicates = [
            new KeyValuePredicate('characterId', characterId),
            new KeyValuePredicate('armorEquipped', 'equipped')
        ];
        var equippedArmors = PersistenceService.findByPredicates(Armor, predicates);
        return equippedArmors.length > 0;
    };

    self.dexBonus = function() {
        var characterId = CharacterManager.activeCharacter().key();
        var rawDexBonus = 0;
        try {
            var scores = PersistenceService.findFirstBy(AbilityScores, 'characterId', characterId);
            rawDexBonus = scores.modifierFor('Dex');
        } catch(err) { /*Ignore*/ }

        if (score) {
            rawDexBonus = parseInt(score);
        }

        var score = 0;
        var predicates = [
            new KeyValuePredicate('characterId', characterId),
            new KeyValuePredicate('armorEquipped', 'equipped'),
            new NotPredicate(new KeyValuePredicate('armorType', 'Shield'))
        ];
        var armors = PersistenceService.findByPredicates(Armor, predicates);
        armors.forEach(function(armor, idx, _) {
            if (armor.armorEquipped() === 'equipped') {
                if (armor.armorType() === 'Medium') {
                    score += rawDexBonus >= 2 ? 2 : rawDexBonus;
                } else {
                    score += rawDexBonus;
                }
            }
        });
        return score;
    };

    self.armorClassModifier = function() {
        var key = CharacterManager.activeCharacter().key()
        var otherStats = PersistenceService.findFirstBy(OtherStats, 'characterId', key);

        return otherStats.armorClassModifier() ? parseInt(otherStats.armorClassModifier()) : 0;
    };

    self.hasArmor = function() {
       var characterId = CharacterManager.activeCharacter().key();
        var predicates = [
            new KeyValuePredicate('characterId', characterId),
            new KeyValuePredicate('armorEquipped', 'equipped'),
            new NotPredicate(new KeyValuePredicate('armorType', 'Shield'))
        ];
        var equippedArmors = PersistenceService.findByPredicates(Armor, predicates);
        return equippedArmors.length > 0;
    };

    self.hasShield = function() {
       var characterId = CharacterManager.activeCharacter().key();
        var predicates = [
            new KeyValuePredicate('characterId', characterId),
            new KeyValuePredicate('armorEquipped', 'equipped'),
            new KeyValuePredicate('armorType', 'Shield')
        ];
        var equippedShield = PersistenceService.findByPredicates(Armor, predicates);
        return equippedShield.length > 0;
    };
}

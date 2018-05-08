import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import {
    KeyValuePredicate,
    NotPredicate
} from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { AbilityScore } from 'charactersheet/models/character/ability_score';
import { Armor } from 'charactersheet/models/common/armor';
import { OtherStats } from 'charactersheet/models/character/other_stats';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { SharedServiceManager } from '../common/shared_service_manager';
import ko from 'knockout';

export var ArmorClassService = new SharedServiceManager(_ArmorClassService, {});

function _ArmorClassService(configuration) {
    var self = this;

    self.armorClass = ko.observable();

    self.init = function() {
        Notifications.armor.changed.add(self.dataHasChanged);
        Notifications.abilityScores.dexterity.changed.add(self.dataHasChanged);
        Notifications.stats.armorClassModifier.changed.add(self.dataHasChanged);

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
            characterId = CoreManager.activeCore().uuid();

        try {
            var scores = PersistenceService.findFirstBy(AbilityScores, 'characterId', characterId);
            rawDexBonus = parseInt(scores.modifierFor('Dex')) ? parseInt(scores.modifierFor('Dex')) : 0;
        } catch(err) { /*Ignore*/ }

        var armor = self._getEquippedArmors()[0];
        if (armor && armor.armorEquipped() === 'equipped') {
            if (armor.armorType() === 'Medium') {
                score += rawDexBonus >= 2 ? 2 : rawDexBonus;
            } else if (armor.armorType() === 'Heavy'){
                /*Score remains 0*/
            } else {
                score += rawDexBonus;
            }
        } else {
            score += rawDexBonus;
        }
        return score;
    };

    self.armorClassModifier = function() {
        var key = CoreManager.activeCore().uuid();
        var otherStats = PersistenceService.findFirstBy(OtherStats, 'characterId', key);
        var armorClassModifier = 0;

        if (otherStats) {
            armorClassModifier = otherStats.armorClassModifier() ? parseInt(otherStats.armorClassModifier()) : 0;
        }

        return armorClassModifier;
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
        var characterId = CoreManager.activeCore().uuid();
        var predicates = [
            new KeyValuePredicate('characterId', characterId),
            new KeyValuePredicate('armorEquipped', 'equipped'),
            new NotPredicate(new KeyValuePredicate('armorType', 'Shield'))
        ];

        return PersistenceService.findByPredicates(Armor, predicates);
    };

    self._getEquippedShields = function() {
        var characterId = CoreManager.activeCore().uuid();
        var predicates = [
            new KeyValuePredicate('characterId', characterId),
            new KeyValuePredicate('armorEquipped', 'equipped'),
            new KeyValuePredicate('armorType', 'Shield')
        ];
        return PersistenceService.findByPredicates(Armor, predicates);
    };
}

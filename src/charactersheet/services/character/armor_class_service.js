import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { AbilityScore } from 'charactersheet/models/character/ability_score';
import { Armor } from 'charactersheet/models/common/armor';
import { Fixtures } from 'charactersheet/utilities/fixtures';
import { OtherStats } from 'charactersheet/models/character/other_stats';
import { SharedServiceManager } from '../common/shared_service_manager';
import ko from 'knockout';

export var ArmorClassService = new SharedServiceManager(_ArmorClassService, {});

function _ArmorClassService(configuration) {
    var self = this;

    self.armorClass = ko.observable();
    self.equippedArmor = ko.observable();
    self.equippedShield = ko.observable();

    self.init = function() {
        Notifications.armor.changed.add(self.dataHasChanged);
        Notifications.abilityScores.dexterity.changed.add(self.dataHasChanged);
        Notifications.stats.armorClassModifier.changed.add(self.dataHasChanged);

        // Kick it off the first time.
        self.dataHasChanged();
    };

    self.dataHasChanged = async function() {
        await self.loadAndSetArmors();
        var calculatedAC = self.baseArmorClass();
        var dexBonus = await self.dexBonusFromArmor();
        var armorMagicalModifier = self.equippedArmorMagicalModifier();
        var shieldMagicalModifier = self.equippedShieldMagicalModifier();
        var shieldBonus = self.getEquippedShieldBonus();
        var armorClassModifier = await self.armorClassModifier();

        // Always add this modifier.
        calculatedAC += armorClassModifier;
        calculatedAC += dexBonus;
        calculatedAC += shieldMagicalModifier + shieldBonus;
        calculatedAC += armorMagicalModifier;

        // Set the value and let everyone know.
        self.armorClass(calculatedAC);
        Notifications.armorClass.changed.dispatch();
    };

    /* Public Methods */

    self.baseArmorClass = function() {
        var armorClass = 10;

        var armor = self.equippedArmor();
        if (armor) {
            var value = parseInt(armor.armorClass());
            return value ? value : 0;
        }

        return armorClass;
    };

    self.equippedArmorMagicalModifier = function() {
        var armor = self.equippedArmor(),
            magicalModifier = 0;

        if (armor) {
            var modifier = parseInt(armor.magicalModifier());
            magicalModifier = modifier ? modifier : 0;
        }
        return magicalModifier;
    };

    self.equippedShieldMagicalModifier = function() {
        var shield = self.equippedShield(),
            magicalModifier = 0;

        if (shield) {
            var modifier = parseInt(shield.magicalModifier());
            magicalModifier = modifier ? modifier : 0;
        }

        return magicalModifier;
    };

    self.dexBonusFromArmor = async function() {
        var score = 0,
            rawDexBonus = 0;

        var coreUuid = CoreManager.activeCore().uuid();
        const response = await AbilityScore.ps.list({coreUuid, name: Fixtures.abilityScores.constants.dexterity.name});
        rawDexBonus = response.objects[0];

        if (rawDexBonus === null) {
            rawDexBonus = 0;
        } else {
            rawDexBonus = rawDexBonus.getModifier();
        }

        if (self.equippedArmor()) {
            if (self.equippedArmor().type === Fixtures.armor.constants.types.medium) {
                // Medium armor gets dex bonus up to 2
                score = rawDexBonus >= 2 ? 2 : rawDexBonus;
            } else if (self.equippedArmor().type === Fixtures.armor.constants.types.light) {
                // Light armor gets all the dex bonus
                score = rawDexBonus;
            } else {
                // This case would be for armor of type heavy or no type specified
                score = 0;
            }
        } else {
            // This means the character is wearing no armor,
            // in which case they get all the dex bonus
            score = rawDexBonus;
        }
        return score;
    };

    self.armorClassModifier = async function() {
        var uuid = CoreManager.activeCore().uuid();
        var otherStatsResponse = await OtherStats.ps.read({uuid});
        const otherStats = otherStatsResponse.object;
        var armorClassModifier = 0;

        if (otherStats) {
            armorClassModifier = otherStats.armorClassModifier() ? parseInt(otherStats.armorClassModifier()) : 0;
        }

        return armorClassModifier;
    };

    self.getEquippedShieldBonus = function() {
        if (self.equippedShield()) {
            var armorClass = parseInt(self.equippedShield().armorClass());
            return armorClass ? armorClass : 0;
        }

        return 0;
    };

    /* Private Methods */

    self.loadAndSetArmors = async function() {
        var coreUuid = CoreManager.activeCore().uuid();
        const response = await Armor.ps.list({coreUuid, equipped: true});
        let armors = response.objects;

        this.setEquippedArmor(armors);
        this.setEquippedShield(armors);
    };

    self.setEquippedArmor = function(armors) {
        const equippedArmor = armors.filter((armor) => {
            return armor.type() != 'Shield';
        })[0];
        self.equippedArmor(equippedArmor);
    };

    self.setEquippedShield = function(armors) {
        const equippedShield = armors.filter((armor) => {
            return armor.type() == 'Shield';
        })[0];
        self.equippedShield(equippedShield);
    };
}

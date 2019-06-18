import { AbilityScore, Armor } from 'charactersheet/models';
import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';

import { Fixtures } from 'charactersheet/utilities/fixtures';
import { OtherStats } from 'charactersheet/models/character/other_stats';
import { SharedServiceManager } from '../common/shared_service_manager';

import { find } from 'lodash';
import ko from 'knockout';

export var ArmorClassService = new SharedServiceManager(_ArmorClassService, {});

function _ArmorClassService(configuration) {
    const self = this;

    self.init = async () => {
        self.equippedArmor = ko.observable(null);
        self.equippedShield = ko.observable(null);
        self.dexterity = ko.observable(new AbilityScore());
        self.otherStats = ko.observable(new OtherStats());
        await self.loadDexterity();
        await self.loadArmors();
        await self.loadOtherStats();
        self.setUpSubscriptions();
    };

    self.loadOtherStats = async () => {
        const response = await OtherStats.ps.read({
            uuid: CoreManager.activeCore().uuid()
        });
        self.otherStats().importValues(response.object.exportValues());
    };

    self.loadDexterity = async () => {
        const response = await AbilityScore.ps.list({
            coreUuid: CoreManager.activeCore().uuid(),
            name: Fixtures.abilityScores.constants.dexterity.name});
        self.dexterity().importValues(response.objects[0].exportValues());
    };

    self.loadArmors = async () => {
        const response = await Armor.ps.list({
            coreUuid: CoreManager.activeCore().uuid(),
            equipped: true
        });
        self.setEquippedArmor(response.objects);
        self.setEquippedShield(response.objects);
    };

    self.setEquippedArmor = (armors) => {
        const equippedArmor = find(armors, (armor) => {
            return (armor.type() !== Fixtures.armor.constants.types.shield) && armor.equipped();
        });
        if (equippedArmor) {
            self.equippedArmor(equippedArmor);
        }
    };

    self.setEquippedShield = (armors) => {
        const equippedShield = find(armors, (armor) => {
            return (armor.type() === Fixtures.armor.constants.types.shield) && armor.equipped();
        });
        if (equippedShield) {
            self.equippedShield(equippedShield);
        }
    };

    self.armorClass = ko.pureComputed(() => {
        return self.baseArmorClass() + self.equippedArmorMagicalModifier() +
               self.dexBonusFromArmor() + self.getEquippedShieldBonus() +
               self.equippedShieldMagicalModifier() + self.armorClassModifier();
    });

    self.baseArmorClass = ko.pureComputed(() => {
        if (self.equippedArmor() && self.equippedArmor().armorClass()) {
            const baseAc = parseInt(self.equippedArmor().armorClass());
            return baseAc ? baseAc : 0;
        }
        return 10;
    });

    self.equippedArmorMagicalModifier = ko.pureComputed(() => {
        if (self.equippedArmor() && self.equippedArmor().magicalModifier()) {
            const modifier = parseInt(self.equippedArmor().magicalModifier());
            return modifier ? modifier : 0;
        }
        return 0;
    });

    self.getEquippedShieldBonus = ko.pureComputed(() => {
        if (self.equippedShield() && self.equippedShield().armorClass()) {
            const shieldAc = parseInt(self.equippedShield().armorClass());
            return shieldAc ? shieldAc : 0;
        }
        return 0;
    });

    self.equippedShieldMagicalModifier = ko.pureComputed(() => {
        if (self.equippedShield() && self.equippedShield().magicalModifier()) {
            const modifier = parseInt(self.equippedShield().magicalModifier());
            return modifier ? modifier : 0;
        }
        return 0;
    });

    self.dexBonusFromArmor = ko.pureComputed(()=> {
        let dexMod = self.dexterity().getModifier();
        if (!dexMod) {
            return 0;
        }
        if (self.equippedArmor()) {
            if (self.equippedArmor().type() === Fixtures.armor.constants.types.heavy) {
                return 0;
            } else if (self.equippedArmor().type() === Fixtures.armor.constants.types.medium) {
                return dexMod > 2 ? 2 : dexMod;
            } else if (self.equippedArmor().type() === Fixtures.armor.constants.types.light) {
                return dexMod;
            }
        }
        return dexMod;
    });

    self.armorClassModifier = ko.pureComputed(() => {
        if (self.otherStats() && self.otherStats().armorClassModifier()) {
            const modifier = parseInt(self.otherStats().armorClassModifier());
            return modifier ? modifier : 0;
        }
        return 0;
    });


    self.setUpSubscriptions = () => {
        Notifications.armor.changed.add(self.updateArmor);
        Notifications.abilityScores.changed.add(self.updateDexterity);
        Notifications.otherStats.changed.add(self.updateOtherStats);
        self.armorClass.subscribe(() => Notifications.armorClass.changed.dispatch());
    };

    self.updateDexterity = (abilityScore) => {
        if (abilityScore && abilityScore.uuid() === self.dexterity().uuid()) {
            self.dexterity().importValues(abilityScore.exportValues());
        }
    };

    self.updateOtherStats = (otherStats) => {
        if (otherStats && otherStats.uuid() === self.otherStats().uuid()) {
            self.otherStats().importValues(otherStats.exportValues());
        }
    };

    self.updateArmor = (armor) => {
        if (armor) {
            if (armor.equipped()) {
                if (armor.type() === Fixtures.armor.constants.types.shield) {
                    self.equippedShield(armor);
                } else {
                    self.equippedArmor(armor);
                }
            } else if (armor.uuid() === self.equippedArmor().uuid()) {
                self.equippedArmor(null);
            } else if (armor.uuid() === self.equippedShield().uuid()) {
                self.equippedShield(null);
            }
        }
    };
}

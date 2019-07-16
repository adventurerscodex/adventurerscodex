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

    self.equippedArmor = ko.observable();
    self.equippedShield = ko.observable();
    self.dexterity = ko.observable();
    self.otherStats = ko.observable();

    self.init = async () => {
        await self.load();
        self.setUpSubscriptions();
    };

    self.load = async (core) => {
        let activeCore;
        if (core) {
            activeCore = core;
        } else {
            activeCore = CoreManager.activeCore();
        }
        if (ko.utils.unwrapObservable(activeCore.type.name) !== 'character') {
            return;
        }
        self.otherStats(new OtherStats());
        self.dexterity(new AbilityScore());
        self.equippedArmor(null);
        self.equippedShield(null);
        await self.loadDexterity(activeCore.uuid());
        await self.loadArmors(activeCore.uuid());
        await self.loadOtherStats(activeCore.uuid());
    };

    self.reload = (oldCore, newCore) => {
        self.otherStats(null);
        self.dexterity(null);
        self.equippedArmor(null);
        self.equippedShield(null);
        self.load(newCore);
    };
    self.loadOtherStats = async (coreKey) => {
        await self.otherStats().load({
            uuid: coreKey
        });
    };

    self.loadDexterity = async (coreKey) => {
        const response = await AbilityScore.ps.list({
            coreUuid: coreKey,
            name: Fixtures.abilityScores.constants.dexterity.name});
        self.updateDexterity(response.objects[0]);
    };

    self.loadArmors = async (coreKey) => {
        const response = await Armor.ps.list({
            coreUuid: coreKey,
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

        let dex = self.dexterity();
        if (!dex) {
            return 0;
        }
        let dexMod = dex.getModifier();
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
        Notifications.armor.added.add(self.updateArmor);
        Notifications.armor.changed.add(self.updateArmor);
        Notifications.armor.deleted.add(self.deleteArmor);
        Notifications.abilityscore.changed.add(self.updateDexterity);
        Notifications.otherstats.changed.add(self.updateOtherStats);
        Notifications.coreManager.changing.add(self.reload);
        self.armorClass.subscribe(() => Notifications.armorClass.changed.dispatch());
    };

    self.updateDexterity = (abilityScore) => {
        if (abilityScore && abilityScore.name() === Fixtures.abilityScores.constants.dexterity.name) {
            self.dexterity().importValues(abilityScore.exportValues());
        }
    };

    self.updateOtherStats = (otherStats) => {
        if (otherStats) {
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
            } else if (self.equippedArmor() && armor.uuid() === self.equippedArmor().uuid()) {
                self.equippedArmor(null);
            } else if (self.equippedShield() && armor.uuid() === self.equippedShield().uuid()) {
                self.equippedShield(null);
            }
        }
    };

    self.deleteArmor = (armor) => {
        if (armor) {
            if (self.equippedArmor() && armor.uuid() === self.equippedArmor().uuid()) {
                self.equippedArmor(null);
            } else if (self.equippedShield() && armor.uuid() === self.equippedShield().uuid()) {
                self.equippedShield(null);
            }
        }
    };
}

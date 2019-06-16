import 'bin/popover_bind';
import {
    AbilityScore,
    OtherStats
} from 'charactersheet/models/character';

import {
    ArmorClassService,
    ProficiencyService
} from 'charactersheet/services';

import {
    CoreManager,
    Fixtures,
    Notifications
} from 'charactersheet/utilities';

import { AbstractViewModel } from 'charactersheet/viewmodels/abstract';

import autoBind from 'auto-bind';
import { getModifier } from 'charactersheet/models/character/ability_score';


import ko from 'knockout';
import template from './view.html';

export class OtherStatsViewModel extends AbstractViewModel {
    constructor(params) {
        super(params);
        // Calculated Fields
        this.armorClass = ko.observable();
        this.proficiencyLabel = ko.observable();
        this.initiativeLabel = ko.observable();

        this.initiativePopover = ko.observable();
        this.proficiencyPopover = ko.observable();
        this.armorClassPopover = ko.observable();
        autoBind(this);
    }
    modelName = 'OtherStats';

    async load() {
        await super.load();
        this.calculateInitiativeLabel();
        this.updateArmorClass();
        this.calculatedProficiencyLabel();
    }

    setUpSubscriptions = () => {
        super.setUpSubscriptions();
        Notifications.armorClass.changed.add(this.updateArmorClass);
        Notifications.abilityScores.dexterity.changed.add(this.calculateInitiativeLabel);
        Notifications.proficiencyBonus.changed.add(this.calculatedProficiencyLabel);
    }

    // Calculate proficiency label and popover
    calculatedProficiencyLabel = async () => {
        const proficiencyService = ProficiencyService.sharedService();
        var level = await proficiencyService.proficiencyBonusByLevel();
        const proficiency = parseInt(this.entity().proficiencyModifier());
        this.updateProficiencyPopoverMessage(level, proficiency);
        this.proficiencyLabel(proficiencyService.proficiency());
    }

    updateProficiencyPopoverMessage = (level, proficiency) => {
        this.proficiencyPopover('<span style="white-space:nowrap;"><strong>Proficiency</strong> = '
            + '(<strong>Level</strong> / 4) + 1 + <strong>Modifier</strong></span><br />'
            + `Proficiency = ${level} + 1 + ${proficiency}`);
    }

    // Calculate initiative label and popover
    calculateInitiativeLabel = async () => {
        const key = CoreManager.activeCore().uuid();
        const response = await AbilityScore.ps.list({
            coreUuid: key,
            name: Fixtures.abilityScores.constants.dexterity.name
        });
        const dexterityModifier = response.objects[0].getModifier();
        const initiativeModifier = this.entity().initiativeModifier();
        this.updateInitiativePopoverMessage(dexterityModifier, initiativeModifier);
        this.initiativeLabel(parseInt(dexterityModifier) + parseInt(initiativeModifier));
    }

    updateInitiativePopoverMessage = (dexterityModifier, initiativeModifier) => {
        this.initiativePopover('<span style="white-space:nowrap;"><strong>Initiative</strong> = ' +
        'Dexterity Modifier + Modifier</span><br />' +
        `Initiative = ${dexterityModifier} + ${initiativeModifier}`);
    }

    updateArmorClassPopoverMessage = async () => {
        const acService = ArmorClassService.sharedService();
        const baseAC = acService.baseArmorClass();
        const dexMod = await acService.dexBonusFromArmor();
        const magicModifiers = acService.equippedArmorMagicalModifier() + acService.equippedShieldMagicalModifier();
        const shield = acService.getEquippedShieldBonus();
        const modifier = this.entity().armorClassModifier() ? this.entity().armorClassModifier() : 0;
        this.armorClassPopover('<span><strong>Armor Class</strong> = '
         + 'Base AC + Dexterity Modifier + Magical Modifier(s) + Shield + Modifier</span><br />'
         + `<strong>Armor Class</strong> = ${baseAC} + ${dexMod} + ${magicModifiers} + ${shield} + ${modifier}`);
    }

    updateArmorClass = async () => {
        await this.updateArmorClassPopoverMessage();
        this.armorClass(ArmorClassService.sharedService().armorClass());
    }

    toggleInspiration = async () => {
        this.entity().inspiration(!this.entity().inspiration());
        await this.entity().ps.save();
        Notifications.otherStats.inspiration.changed.dispatch();
    }
}

ko.components.register('other-stats-view', {
    viewModel: OtherStatsViewModel,
    template: template
});

import 'bin/popover_bind';
import {
    AbilityScore,
    OtherStats,
    Profile
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
import { OtherStatsFormViewModel } from './form';

import { getModifier } from 'charactersheet/models/character/ability_score';
import ko from 'knockout';
import template from './index.html';

class ACViewModel {
    constructor(params) {
        this.tabId = params.tabId;
        this.loaded = ko.observable(false);
        this.data = {};
    }
    async load() {
        this.loaded(false);
        await this.refresh();
    }

    async reset() {
        await this.refresh();
    }
}

export class OtherStatsViewModel extends ACViewModel {
    constructor(params) {
        super(params);
        this.data = {
            otherStats: ko.observable(new OtherStats()),
            profile: ko.observable(new Profile())
        };
        // Calculated Field
        this.armorClass = ko.observable();

        this.proficiencyLabel = ko.observable();
        this.initiativeLabel = ko.observable();

        this.initiativePopover = ko.observable();
        this.proficiencyPopover = ko.observable();
        this.armorClassPopover = ko.observable();

        // Monitoring fields
        this.hasProficiencyChanged = ko.observable(false);
        this.hasInspirationChanged = ko.observable(false);
        this.hasInitiativeChanged = ko.observable(false);
        this.hasAcChanged = ko.observable(false);
        this.hasLevelChanged = ko.observable(false);
        this.hasExperienceChanged = ko.observable(false);
    }

    async load() {
        await super.load();

        this.calculateInitiativeLabel();
        this.updateArmorClass();
        this.calculatedProficiencyLabel();
        // Subscriptions
        this.setUpModelSubscriptions();
        this.monitorSubscriptions();
    }

    monitorSubscriptions = () => {
        Notifications.armorClass.changed.add(this.updateArmorClass);
        Notifications.abilityScores.dexterity.changed.add(this.calculateInitiativeLabel);
        Notifications.proficiencyBonus.changed.add(this.calculatedProficiencyLabel);
    }

    refresh = async () => {
        const key = CoreManager.activeCore().uuid();
        const otherStats = await OtherStats.ps.read({uuid: key});
        const profile = await Profile.ps.read({uuid: key});
        this.data.otherStats(otherStats.object);
        this.data.profile(profile.object);
        this.loaded(true);
    }

    setUpModelSubscriptions = () => {
        this.data.otherStats().proficiencyModifier.subscribe(this.proficiencyHasChanged);
        this.data.otherStats().inspiration.subscribe(this.inspirationHasChanged);
        this.data.otherStats().initiativeModifier.subscribe(this.initiativeHasChanged);
        this.data.otherStats().armorClassModifier.subscribe(this.armorClassModifierDataHasChanged);
        this.data.profile().level.subscribe(this.levelDataHasChanged);
        this.data.profile().experience.subscribe(this.experienceDataHasChanged);
    }


    // Calculate proficiency label and popover
    calculatedProficiencyLabel = async () => {
        const proficiencyService = ProficiencyService.sharedService();
        var level = await proficiencyService.proficiencyBonusByLevel();
        const proficiency = parseInt(this.data.otherStats().proficiencyModifier());
        this.updateProficiencyPopoverMessage(level, proficiency);
        this.proficiencyLabel(proficiencyService.proficiency());
    }

    updateProficiencyPopoverMessage = (level, proficiency) => {
        this.proficiencyPopover('<span style="white-space:nowrap;"><strong>Proficiency</strong> = '
            + '(<strong>Level</strong> / 4) + 1 + <strong>Modifier</strong></span><br />Proficiency = '
            + level + ' + 1 + ' + proficiency);
    }

    // Calculate initiative label and popover
    calculateInitiativeLabel = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await AbilityScore.ps.list({coreUuid: key,
            name: Fixtures.abilityScores.constants.dexterity.name});
        var dexterityModifier = response.objects[0].getModifier();
        var initiativeModifier = this.data.otherStats().initiativeModifier();
        this.updateInitiativePopoverMessage(dexterityModifier, initiativeModifier);
        this.initiativeLabel(parseInt(dexterityModifier) + parseInt(initiativeModifier));
    }

    updateInitiativePopoverMessage = (dexterityModifier, initiativeModifier) => {
        this.initiativePopover('<span style="white-space:nowrap;"><strong>Initiative</strong> = ' +
        'Dexterity Modifier + Modifier</span><br />'
            + 'Initiative = ' + dexterityModifier + ' + ' + initiativeModifier );
    }

    updateArmorClassPopoverMessage = async () => {
        const acService = ArmorClassService.sharedService();
        const baseAC = acService.baseArmorClass();
        const dexMod = await acService.dexBonusFromArmor();
        const magicModifiers = acService.equippedArmorMagicalModifier() + acService.equippedShieldMagicalModifier();
        const shield = acService.getEquippedShieldBonus();

        const modifier = this.data.otherStats().armorClassModifier() ? this.data.otherStats().armorClassModifier() : 0;

        this.armorClassPopover('<span><strong>Armor Class</strong> = ' +
        'Base AC + Dexterity Modifier + Magical Modifier(s) + Shield + Modifier</span><br />' +
        '<strong>Armor Class</strong> = ' + baseAC + ' + ' + dexMod + ' + ' + magicModifiers +
        ' + ' + shield + ' + ' + modifier);
    }

    updateArmorClass = async () => {
        await this.updateArmorClassPopoverMessage();
        this.armorClass(ArmorClassService.sharedService().armorClass());
    }

    toggleInspiration = async () => {
        this.data.otherStats().inspiration(!this.data.otherStats().inspiration());
        await this.data.otherStats().ps.save();
        Notifications.otherStats.inspiration.changed.dispatch();
        this.hasInspirationChanged(false);
    }

    save = async ({ notify, data }) => {
        const { otherStats, profile } = data;
        const otherStatsResponse = await otherStats().ps.save();
        const profileResponse = await profile().ps.save();

        otherStats(otherStatsResponse.object);
        profile(profileResponse.object);
        notify();
    }

    reset = async ({ refresh }) => {
        refresh();
    }

    inspirationHasChanged = () => {
        this.hasInspirationChanged(true);
    }

    initiativeHasChanged = () => {
        this.hasInitiativeChanged(true);
    }

    armorClassModifierDataHasChanged = () => {
        this.hasAcChanged(true);
    }

    levelDataHasChanged = () => {
        this.hasLevelChanged(true);
    }

    experienceDataHasChanged = () => {
        this.hasExperienceChanged(true);
    }

    proficiencyHasChanged = () => {
        this.hasProficiencyChanged(true);
    }

    notify = async () => {
        if (this.hasInspirationChanged()) {
            Notifications.otherStats.inspiration.changed.dispatch();
        }

        if (this.hasAcChanged()) {
            Notifications.stats.armorClassModifier.changed.dispatch();
        }

        if (this.hasLevelChanged()) {
            Notifications.profile.level.changed.dispatch();
        }

        if (this.hasExperienceChanged()) {
            Notifications.profile.experience.changed.dispatch();
        }

        if (this.hasProficiencyChanged()) {
            Notifications.otherStats.proficiency.changed.dispatch();
        }

        if (this.hasInitiativeChanged()) {
            await this.calculateInitiativeLabel();
        }

        this.resetSubscriptions();
    }

    resetSubscriptions = () => {
        this.setUpModelSubscriptions();
        this.hasInspirationChanged(false);
        this.hasAcChanged(false);
        this.hasLevelChanged(false);
        this.hasExperienceChanged(false);
        this.hasProficiencyChanged(false);
        this.hasInitiativeChanged(false);
    }

}

ko.components.register('other-stats', {
    viewModel: OtherStatsViewModel,
    template: template
});

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

import { getModifier } from 'charactersheet/models/character/ability_score';

import ko from 'knockout';
import template from './view.html';

class ACViewModel {
    constructor(params) {
        // Card Properties
        this.containerId = ko.utils.unwrapObservable(params.containerId);
        this.showBack = params.showBack;
        this.flip = params.flip;

        this.loaded = ko.observable(false);
    }

    async load() {
        this.loaded(false);
        await this.refresh();
        this.setUpSubscriptions();
        this.loaded(true);
    }

    async refresh() {
        throw('refresh must be defined by subclasses of ACViewModel');
    }

    setUpSubscriptions() {
        this.showBack.subscribe(this.subscribeToShowForm);
    }

    subscribeToShowForm = () => {
        if (!this.showBack()) {
            this.refresh();
        }
    }
}

export class OtherStatsViewModel extends ACViewModel {
    constructor(params) {
        super(params);

        this.otherStats = ko.observable(new OtherStats());
        this.profile = ko.observable(new Profile());

        // Calculated Field
        this.armorClass = ko.observable();

        this.proficiencyLabel = ko.observable();
        this.initiativeLabel = ko.observable();

        this.initiativePopover = ko.observable();
        this.proficiencyPopover = ko.observable();
        this.armorClassPopover = ko.observable();
    }

    async load() {
        await super.load();
        this.calculateInitiativeLabel();
        this.updateArmorClass();
        this.calculatedProficiencyLabel();
        // Subscriptions
        this.monitorSubscriptions();
    }

    refresh = async () => {
        const key = CoreManager.activeCore().uuid();
        const otherStats = await OtherStats.ps.read({uuid: key});
        const profile = await Profile.ps.read({uuid: key});
        this.otherStats(otherStats.object);
        this.profile(profile.object);
    }

    monitorSubscriptions = () => {
        Notifications.armorClass.changed.add(this.updateArmorClass);
        Notifications.abilityScores.dexterity.changed.add(this.calculateInitiativeLabel);
        Notifications.proficiencyBonus.changed.add(this.calculatedProficiencyLabel);
    }

    // Calculate proficiency label and popover
    calculatedProficiencyLabel = async () => {
        const proficiencyService = ProficiencyService.sharedService();
        var level = await proficiencyService.proficiencyBonusByLevel();
        const proficiency = parseInt(this.otherStats().proficiencyModifier());
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
        const initiativeModifier = this.otherStats().initiativeModifier();

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

        const modifier = this.otherStats().armorClassModifier() ? this.otherStats().armorClassModifier() : 0;

        this.armorClassPopover('<span><strong>Armor Class</strong> = '
         + 'Base AC + Dexterity Modifier + Magical Modifier(s) + Shield + Modifier</span><br />'
         + `<strong>Armor Class</strong> = ${baseAC} + ${dexMod} + ${magicModifiers} + ${shield} + ${modifier}`);
    }

    updateArmorClass = async () => {
        await this.updateArmorClassPopoverMessage();
        this.armorClass(ArmorClassService.sharedService().armorClass());
    }

    toggleInspiration = async () => {
        this.otherStats().inspiration(!this.otherStats().inspiration());
        await this.otherStats().ps.save();
        Notifications.otherStats.inspiration.changed.dispatch();
    }
}

ko.components.register('other-stats-view', {
    viewModel: OtherStatsViewModel,
    template: template
});

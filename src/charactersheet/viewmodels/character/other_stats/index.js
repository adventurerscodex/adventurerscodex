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
import template from './index.html';

export function OtherStatsViewModel() {
    var self = this;

    self.otherStats = ko.observable(new OtherStats());
    self.profile = ko.observable(new Profile());
    self.armorClass = ko.observable();
    self.level = ko.observable('');
    self.experience = ko.observable('');
    self.proficiencyService = ko.observable();
    self.proficiencyLabel = ko.observable();
    self.initiativeLabel = ko.observable();
    self.initiativePopover = ko.observable();
    self.proficiencyPopover = ko.observable();
    self.armorClassPopover = ko.observable();

    self.load = async () => {
        self.proficiencyService(ProficiencyService.sharedService());

        var key = CoreManager.activeCore().uuid();
        var otherStats = await OtherStats.ps.read({uuid: key});
        self.otherStats(otherStats.object);

        const profile = await Profile.ps.read({uuid: key});
        self.profile(profile.object);

        self.calculateInitiativeLabel();
        self.updateArmorClass();
        self.calculatedProficiencyLabel();

        // Subscriptions
        self.otherStats().proficiencyModifier.subscribe(self.proficiencyHasChanged);
        self.otherStats().inspiration.subscribe(self.inspirationHasChanged);
        self.otherStats().initiativeModifier.subscribe(self.initiativeHasChanged);
        self.otherStats().armorClassModifier.subscribe(self.armorClassModifierDataHasChanged);
        self.otherStats().speed.subscribe(self.dataHasChanged);
        self.profile().level.subscribe(self.levelDataHasChanged);
        self.profile().experience.subscribe(self.experienceDataHasChanged);
        Notifications.armorClass.changed.add(self.updateArmorClass);
        Notifications.abilityScores.dexterity.changed.add(self.calculateInitiativeLabel);
    };

    // Calculate proficiency label and popover
    self.calculatedProficiencyLabel = function() {
        var level = self.proficiencyService().proficiencyBonusByLevel();
        const proficiency = parseInt(self.otherStats().proficiencyModifier());
        self.updateProficiencyPopoverMessage(level, proficiency);
        self.proficiencyLabel(self.proficiencyService().proficiency());
    };

    self.updateProficiencyPopoverMessage = function(level, proficiency) {
        self.proficiencyPopover('<span style="white-space:nowrap;"><strong>Proficiency</strong> = '
            + '(<strong>Level</strong> / 4) + 1 + <strong>Modifier</strong></span><br />Proficiency = '
            + level + ' + 1 + ' + proficiency);
    };

    // Calculate initiative label and popover
    self.calculateInitiativeLabel = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await AbilityScore.ps.list({coreUuid: key,
            name: Fixtures.abilityScores.constants.dexterity.name});
        var dexterityModifier = response.objects[0].getModifier();
        var initiativeModifier = self.otherStats().initiativeModifier();
        self.updateInitiativePopoverMessage(dexterityModifier, initiativeModifier);

        self.initiativeLabel(parseInt(dexterityModifier) + parseInt(initiativeModifier));
    };

    self.updateInitiativePopoverMessage = function(dexterityModifier, initiativeModifier) {
        self.initiativePopover('<span style="white-space:nowrap;"><strong>Initiative</strong> = ' +
        'Dexterity Modifier + Modifier</span><br />'
            + 'Initiative = ' + dexterityModifier + ' + ' + initiativeModifier );
    };

    self.updateArmorClassPopoverMessage = async function() {
        var acService = ArmorClassService.sharedService();
        var baseAC = acService.baseArmorClass(),
            dexMod = await acService.dexBonusFromArmor(),
            magicModifiers = acService.equippedArmorMagicalModifier() + acService.equippedShieldMagicalModifier(),
            shield = acService.getEquippedShieldBonus();

        let modifier = self.otherStats().armorClassModifier() ? self.otherStats().armorClassModifier() : 0;

        self.armorClassPopover('<span><strong>Armor Class</strong> = ' +
        'Base AC + Dexterity Modifier + Magical Modifier(s) + Shield + Modifier</span><br />' +
        '<strong>Armor Class</strong> = ' + baseAC + ' + ' + dexMod + ' + ' + magicModifiers +
        ' + ' + shield + ' + ' + modifier);
    };

    self.updateArmorClass = function() {
        self.updateArmorClassPopoverMessage();
        self.armorClass(ArmorClassService.sharedService().armorClass());
    };

    self.toggleInspiration = async () => {
        self.otherStats().inspiration(!self.otherStats().inspiration());
        await self.inspirationHasChanged();
    };

    self.inspirationHasChanged = async () => {
        await self.save();
        Notifications.otherStats.inspiration.changed.dispatch();
    };

    self.dataHasChanged = function() {
        self.save();
    };

    self.initiativeHasChanged = async () => {
        await self.save();
        self.calculateInitiativeLabel();
    };

    self.armorClassModifierDataHasChanged = async () => {
        await self.save();
        Notifications.stats.armorClassModifier.changed.dispatch();
    };

    self.levelDataHasChanged = async () => {
        const profile = await self.profile().ps.save();
        Notifications.profile.level.changed.dispatch();
    };

    self.experienceDataHasChanged = async () => {
        const profile = await self.profile().ps.save();
        Notifications.profile.experience.changed.dispatch();
    };

    self.proficiencyHasChanged = async () => {
        await self.save();
        Notifications.otherStats.proficiency.changed.dispatch();
    };

    self.save = async () => {
        await self.otherStats().ps.save();
    };
}

ko.components.register('other-stats', {
    viewModel: OtherStatsViewModel,
    template: template
});

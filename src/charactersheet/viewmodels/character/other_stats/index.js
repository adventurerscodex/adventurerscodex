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
    self.proficiencyLabel = ko.observable();
    self.initiativeLabel = ko.observable();
    self.initiativePopover = ko.observable();
    self.proficiencyPopover = ko.observable();
    self.armorClassPopover = ko.observable();
    self.loaded = ko.observable(false);

    self.hasProficiencyChanged = ko.observable(false);
    self.hasInspirationChanged = ko.observable(false);
    self.hasInitiativeChanged = ko.observable(false);
    self.hasAcChanged = ko.observable(false);
    self.hasLevelChanged = ko.observable(false);
    self.hasExperienceChanged = ko.observable(false);

    self.data = {};

    self.load = async () => {
        self.loaded(false);
        await self.reset();

        self.calculateInitiativeLabel();
        self.updateArmorClass();
        self.calculatedProficiencyLabel();

        // Subscriptions
        self.setUpModelSubscriptions();
        Notifications.armorClass.changed.add(self.updateArmorClass);
        Notifications.abilityScores.dexterity.changed.add(self.calculateInitiativeLabel);
        Notifications.proficiencyBonus.changed.add(self.calculatedProficiencyLabel);
    };

    self.reset = async () => {
        var key = CoreManager.activeCore().uuid();
        var otherStats = await OtherStats.ps.read({uuid: key});
        self.otherStats(otherStats.object);

        const profile = await Profile.ps.read({uuid: key});
        self.profile(profile.object);

        self.data = {
            otherStats: self.otherStats,
            profile: self.profile
        };

        self.loaded(true);
    };

    self.setUpModelSubscriptions = () => {
        self.otherStats().proficiencyModifier.subscribe(self.proficiencyHasChanged);
        self.otherStats().inspiration.subscribe(self.inspirationHasChanged);
        self.otherStats().initiativeModifier.subscribe(self.initiativeHasChanged);
        self.otherStats().armorClassModifier.subscribe(self.armorClassModifierDataHasChanged);
        self.profile().level.subscribe(self.levelDataHasChanged);
        self.profile().experience.subscribe(self.experienceDataHasChanged);
    };

    self.validation = {
        rules : {
            // Deep copy of properties in object
            ...Profile.validationConstraints.rules,
            ...OtherStats.validationConstraints.rules
        }
    };

    // Calculate proficiency label and popover
    self.calculatedProficiencyLabel = async function() {
        const proficiencyService = ProficiencyService.sharedService();
        var level = await proficiencyService.proficiencyBonusByLevel();
        const proficiency = parseInt(self.otherStats().proficiencyModifier());
        self.updateProficiencyPopoverMessage(level, proficiency);
        self.proficiencyLabel(proficiencyService.proficiency());
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
    };

    self.inspirationHasChanged = async () => {
        self.hasInspirationChanged(true);
    };

    self.initiativeHasChanged = async () => {
        self.hasInitiativeChanged(true);
    };

    self.armorClassModifierDataHasChanged = async () => {
        self.hasAcChanged(true);
    };

    self.levelDataHasChanged = async () => {
        self.hasLevelChanged(true);
    };

    self.experienceDataHasChanged = async () => {
        self.hasExperienceChanged(true);
    };

    self.proficiencyHasChanged = async () => {
        self.hasProficiencyChanged(true);
    };

    self.resetSubscriptions = () => {
        self.setUpModelSubscriptions();
        self.hasInspirationChanged(false);
        self.hasAcChanged(false);
        self.hasLevelChanged(false);
        self.hasExperienceChanged(false);
        self.hasProficiencyChanged(false);
        self.hasInitiativeChanged(false);
    };

    self.save = async () => {
        const otherStatsResponse = await self.otherStats().ps.save();
        const profileResponse = await self.profile().ps.save();

        self.otherStats(otherStatsResponse.object);
        self.profile(profileResponse.object);

        if (self.hasInspirationChanged()) {
            Notifications.otherStats.inspiration.changed.dispatch();
        }

        if (self.hasAcChanged()) {
            Notifications.stats.armorClassModifier.changed.dispatch();
        }

        if (self.hasLevelChanged()) {
            Notifications.profile.level.changed.dispatch();
        }

        if (self.hasExperienceChanged()) {
            Notifications.profile.experience.changed.dispatch();
        }

        if (self.hasProficiencyChanged()) {
            Notifications.otherStats.proficiency.changed.dispatch();
        }

        if (self.hasInitiativeChanged()) {
            await self.calculateInitiativeLabel();
        }

        self.resetSubscriptions();
    };
}

ko.components.register('other-stats', {
    viewModel: OtherStatsViewModel,
    template: template
});

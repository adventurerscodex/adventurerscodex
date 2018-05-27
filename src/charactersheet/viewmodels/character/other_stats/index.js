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
    self._dummy = ko.observable();
    self.initiativeLabel = ko.observable();

    self.initiativePopover = ko.observable();
    self.proficiencyPopover = ko.observable();
    self.armorClassPopover = ko.observable();

    self.load = async () => {
        var key = CoreManager.activeCore().uuid();
        var otherStats = await OtherStats.ps.read({uuid: key});
        self.otherStats(otherStats.object);

        const profile = await Profile.ps.read({uuid: key});
        self.profile(profile.object);

        self.calculateInitiativeLabel();
        self.updateArmorClass();

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
    self.calculatedProficiencyLabel = ko.pureComputed(function() {
        self._dummy();
        // TODO: FIX WHEN SERVICE IS REFACTORED
        // var proficiencyService = ProficiencyService.sharedService();
        // var level = proficiencyService.proficiencyBonusByLevel();
        const level = 1;
        const proficiency = parseInt(self.otherStats().proficiencyModifier());
        self.updateProficiencyPopoverMessage(level, proficiency);
        return level + proficiency + 1;
        // return ProficiencyService.sharedService().proficiency();
    });

    self.updateProficiencyPopoverMessage = function(level, proficiency) {
        self.proficiencyPopover('<span style="white-space:nowrap;"><strong>Proficiency</strong> = '
            + '(<strong>Level</strong> / 4) + 1 + <strong>Modifier</strong></span><br />Proficiency = '
            + level + ' + 1 + ' + proficiency);
    };

    // Calculate initiative label and popover
    self.calculateInitiativeLabel = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await AbilityScore.ps.list({coreUuid: key});
        const dexterity = response.objects.filter((score, i, _) => {
            return score.name() === 'Dexterity';
        })[0];
        var dexterityModifier = dexterity.getModifier();
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

    self.inspirationHasChanged = function() {
        self.save();
        Notifications.otherStats.inspiration.changed.dispatch();
    };

    self.dataHasChanged = function() {
        self.save();
    };

    self.initiativeHasChanged = function() {
        self.save();
        self.calculateInitiativeLabel();
    };

    self.armorClassModifierDataHasChanged = function() {
        self.save();
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

    self.proficiencyHasChanged = function() {
        self.save();
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

import ko from 'knockout';

import 'bin/popover_bind';

import { OtherStats,
    Profile,
    AbilityScores } from 'charactersheet/models/character';
import { getModifier } from 'charactersheet/models/character/ability_scores';
import { Notifications,
    CharacterManager } from 'charactersheet/utilities';
import { PersistenceService,
    ArmorClassService,
    ProficiencyService } from 'charactersheet/services';

import template from './index.html';

export function OtherStatsViewModel() {
    var self = this;

    self.otherStats = ko.observable(new OtherStats());
    self.armorClass = ko.observable();
    self.level = ko.observable('');
    self.experience = ko.observable('');
    self._dummy = ko.observable();

    self.initiativePopover = ko.observable();
    self.proficiencyPopover = ko.observable();
    self.armorClassPopover = ko.observable();

    self.load = function() {

        var key = CharacterManager.activeCharacter().key();
        var otherStats = PersistenceService.findBy(OtherStats, 'characterId', key);
        if (otherStats.length > 0) {
            self.otherStats(otherStats[0]);
        } else {
            self.otherStats(new OtherStats());
        }
        self.otherStats().characterId(key);

        var profile = PersistenceService.findBy(Profile, 'characterId', key)[0];
        if (profile) {
            self.level(profile.level());
            self.experience(profile.exp());
        }

        // Subscriptions
        self.otherStats().proficiency.subscribe(self.proficiencyHasChanged);
        self.otherStats().inspiration.subscribe(self.inspirationHasChanged);
        self.otherStats().initiative.subscribe(self.initiativeHasChanged);
        self.otherStats().armorClassModifier.subscribe(self.armorClassModifierDataHasChanged);
        self.otherStats().speed.subscribe(self.dataHasChanged);
        self.level.subscribe(self.levelDataHasChanged);
        self.experience.subscribe(self.experienceDataHasChanged);
        Notifications.profile.changed.add(self._dummy.valueHasMutated);
        Notifications.armorClass.changed.add(self.updateArmorClass);
        Notifications.abilityScores.changed.add(self.calculateInitiativeLabel);
    };

    self.unload = function() {
        self.otherStats().save();

        Notifications.profile.changed.remove(self._dummy.valueHasMutated);
        Notifications.armorClass.changed.remove(self.updateArmorClass);
        Notifications.abilityScores.changed.remove(self.calculateInitiativeLabel);
    };

    // Calculate proficiency label and popover
    self.calculatedProficiencyLabel = ko.pureComputed(function() {
        self._dummy();
        var proficiencyService = ProficiencyService.sharedService();
        var level = proficiencyService.proficiencyBonusByLevel();
        var proficiency = proficiencyService.proficiencyModifier();
        self.updateProficiencyPopoverMessage(level, proficiency);

        return ProficiencyService.sharedService().proficiency();
    });

    self.updateProficiencyPopoverMessage = function(level, proficiency) {
        self.proficiencyPopover('<span style="white-space:nowrap;"><strong>Proficiency</strong> = '
            + '(<strong>Level</strong> / 4) + 1 + <strong>Modifier</strong></span><br />Proficiency = '
            + level + ' + 1 + ' + proficiency);
    };

    // Calculate initiative label and popover
    self.calculateInitiativeLabel = ko.pureComputed(function() {
        var key = CharacterManager.activeCharacter().key();
        var abilityScores = PersistenceService.findFirstBy(AbilityScores, 'characterId', key);
        var dexterityModifier = getModifier(abilityScores.dex()) ? getModifier(abilityScores.dex()) : 0;
        var initiativeModifier = self.otherStats().initiative() ? parseInt(self.otherStats().initiative()) : 0;
        self.updateInitiativePopoverMessage(dexterityModifier, initiativeModifier);

        return dexterityModifier + initiativeModifier;
    });

    self.updateInitiativePopoverMessage = function(dexterityModifier, initiativeModifier) {
        self.initiativePopover('<span style="white-space:nowrap;"><strong>Initiative</strong> = ' +
        'Dexterity Modifier + Modifier</span><br />'
            + 'Initiative = ' + dexterityModifier + ' + ' +  initiativeModifier );
    };

    self.updateArmorClassPopoverMessage = function(dexterityModifier, initiativeModifier) {
        var acService = ArmorClassService.sharedService();
        var baseAC = acService.baseArmorClass(),
            dexMod = acService.dexBonus(),
            magicModifiers = acService.equippedArmorMagicalModifier() + acService.equippedShieldMagicalModifier(),
            shield = acService.hasShield() ? acService.getEquippedShieldBonus() : 0;

        var otherStats = PersistenceService.findFirstBy(OtherStats, 'characterId',
            CharacterManager.activeCharacter().key());
        var modifier = 0;
        if (otherStats) {
            modifier = otherStats.armorClassModifier() ? otherStats.armorClassModifier() : 0;
        }

        self.armorClassPopover('<span><strong>Armor Class</strong> = ' +
        'Base AC + Dexterity Modifier + Magical Modifier(s) + Shield + Modifier</span><br />' +
        '<strong>Armor Class</strong> = ' + baseAC + ' + ' + dexMod + ' + ' +  magicModifiers +
        ' + ' + shield + ' + ' + modifier);
    };

    self.updateArmorClass = function() {
        self.updateArmorClassPopoverMessage();
        self.armorClass(ArmorClassService.sharedService().armorClass());
    };

    self.inspirationHasChanged = function() {
        self.otherStats().save();
        Notifications.otherStats.inspiration.changed.dispatch();
    };

    self.dataHasChanged = function() {
        self.otherStats().save();
    };

    self.initiativeHasChanged = function() {
        self.otherStats().save();
        self.calculateInitiativeLabel();
    };

    self.armorClassModifierDataHasChanged = function() {
        self.otherStats().save();
        Notifications.stats.armorClassModifier.changed.dispatch();
    };

    self.levelDataHasChanged = function() {
        var profile = PersistenceService.findFirstBy(Profile, 'characterId',
            CharacterManager.activeCharacter().key());
        profile.level(self.level());
        profile.save();
        Notifications.profile.level.changed.dispatch();
    };

    self.experienceDataHasChanged = function() {
        var profile = PersistenceService.findFirstBy(Profile, 'characterId',
            CharacterManager.activeCharacter().key());
        profile.exp(self.experience());
        profile.save();
        Notifications.profile.experience.changed.dispatch();
    };

    self.proficiencyHasChanged = function() {
        self.otherStats().save();
        Notifications.otherStats.proficiency.changed.dispatch();
    };
}

ko.components.register('other-stats', {
    viewModel: OtherStatsViewModel,
    template: template
});

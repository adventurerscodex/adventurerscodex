import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { OtherStats } from 'charactersheet/models/character/other_stats';
import { Profile } from 'charactersheet/models/character/profile';
import { SharedServiceManager } from '../common/shared_service_manager';
import ko from 'knockout';

export var ProficiencyService = new SharedServiceManager(_ProficiencyService, {});

function _ProficiencyService(configuration) {
    var self = this;

    self.proficiency = ko.observable();
    self.characterId = ko.observable();
    self.proficiencyModifier = ko.observable();
    self.proficiencyBonusByLevel = ko.observable();

    self.init = async () => {
        Notifications.otherStats.proficiency.changed.add(self.getProficiencyModifierAndReCalculate);
        Notifications.profile.level.changed.add(self.getProficiencyBonusByLevelAndReCalculate);

        self.characterId(CoreManager.activeCore().uuid());
        await self.getProficiencyModifier();
        await self.getProficiencyBonusByLevel();
        // Kick it off the first time.
        await self.dataHasChanged();
    };

    self.dataHasChanged = function() {
        var proficiency = 0;

        proficiency += self.proficiencyModifier();
        proficiency += self.proficiencyBonusByLevel();
        proficiency += 1;

        // Set the value and let everyone know.
        self.proficiency(proficiency);
        Notifications.proficiencyBonus.changed.dispatch();
    };

    /* Public Methods */

    self.getProficiencyModifier = async () => {
        let otherStatsResponse = await OtherStats.ps.read({uuid: self.characterId()});
        const otherStats = otherStatsResponse.object;
        var proficiencyModifier = 0;
        if (otherStats) {
            proficiencyModifier = parseInt(otherStats.proficiencyModifier()) ? parseInt(otherStats.proficiencyModifier()) : 0;
        }
        self.proficiencyModifier(proficiencyModifier);
    };

    self.getProficiencyBonusByLevel = async () => {
        let profileResponse = await Profile.ps.read({uuid: self.characterId()});
        const profile = profileResponse.object;
        var level = 0;
        if (profile) {
            level = parseInt(profile.level()) ? parseInt(profile.level()) : 0;
        }
        self.proficiencyBonusByLevel(Math.ceil(level / 4));
    };

    self.getProficiencyModifierAndReCalculate = async () => {
        await self.getProficiencyModifier();
        self.dataHasChanged();
    };

    self.getProficiencyBonusByLevelAndReCalculate = async () => {
        await self.getProficiencyBonusByLevel();
        self.dataHasChanged();
    };
}

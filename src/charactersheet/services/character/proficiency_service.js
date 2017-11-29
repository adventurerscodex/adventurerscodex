import {
    CharacterManager,
    Notifications
} from 'charactersheet/utilities';
import {
    OtherStats,
    Profile
} from 'charactersheet/models/character';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { SharedServiceManager } from '../common/shared_service_manager';
import ko from 'knockout';

export var ProficiencyService = new SharedServiceManager(_ProficiencyService, {});

function _ProficiencyService(configuration) {
    var self = this;

    self.proficiency = ko.observable();
    self.characterId = ko.observable();

    self.init = function() {
        Notifications.otherStats.proficiency.changed.add(self.dataHasChanged);
        Notifications.profile.level.changed.add(self.dataHasChanged);

        // Kick it off the first time.
        self.characterId(CharacterManager.activeCharacter().key());
        self.dataHasChanged();
    };

    self.dataHasChanged = function() {
        var proficiency = 0;
        var proficiencyModifier = self.proficiencyModifier();
        var proficiencyBonusByLevel = self.proficiencyBonusByLevel();

        proficiency += proficiencyModifier;
        proficiency += proficiencyBonusByLevel;
        proficiency += 1;

        // Set the value and let everyone know.
        self.proficiency(proficiency);
        Notifications.proficiencyBonus.changed.dispatch();
    };

    /* Public Methods */

    self.proficiencyModifier = function() {
        var proficiencyModifier = 0;
        var otherStats = PersistenceService.findFirstBy(OtherStats, 'characterId', self.characterId());
        if (otherStats) {
            proficiencyModifier = parseInt(otherStats.proficiency()) ? parseInt(otherStats.proficiency()) : 0;
        }
        return proficiencyModifier;
    };

    self.proficiencyBonusByLevel = function() {
        var level = 0;
        var profile = PersistenceService.findFirstBy(Profile, 'characterId', self.characterId());
        if (profile) {
            level = parseInt(profile.level()) ? parseInt(profile.level()) : 0;
        }
        return Math.ceil(level / 4);
    };
}

'use strict';

var ProficiencyService = new SharedServiceManager(_ProficiencyService, {});


function _ProficiencyService(configuration) {
    var self = this;

    self.proficiency = ko.observable();
    self.characterId = ko.observable();

    self.init = function() {
        Notifications.profile.changed.add(self.dataHasChanged);
        Notifications.stats.changed.add(self.dataHasChanged);

        // Kick it off the first time.
        self.characterId(CharacterManager.activeCharacter().key());
        self.dataHasChanged();
    };

    self.dataHasChanged = function() {
        // Starts at one because of the static one in the calculation
        var proficiency = 1;
        var proficiencyModifier = self.proficiencyModifier();
        var levelBonus = self.levelBonus();

        proficiency += proficiencyModifier;
        proficiency += levelBonus;

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

    self.levelBonus = function() {
        var level = 0;
        var profile = PersistenceService.findFirstBy(Profile, 'characterId', self.characterId());
        if (profile) {
            level = parseInt(profile.level()) ? parseInt(profile.level()) : 0;
        }
        return Math.ceil(level / 4);
    };
}

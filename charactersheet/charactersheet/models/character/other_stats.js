'use strict';

function OtherStats() {
    var self = this;
    self.ps = PersistenceService.register(OtherStats, self);
    self.mapping = {
        include: ['characterId', 'ac', 'initiative', 'speed',
        'inspiration', 'proficiency']
    };

    self.characterId = ko.observable(null);
    self.ac = ko.observable(10);
    self.initiative = ko.observable(0);
    self.speed = ko.observable(0);
    self.inspiration = ko.observable(0);
    self.proficiency = ko.observable(0);

    /**
    * Calculates user's proficiency based on this formula:
    * ceil(level / 4) + 1
    */
    self.proficiencyLabel = ko.pureComputed(function() {
        self._proficiencyLabelDummy();
        var key = CharacterManager.activeCharacter().key();
        var level = PersistenceService.findBy(Profile, 'characterId', key)[0].level();
        level = level ? parseInt(level) : 0;
        var proficiency = parseInt(self.proficiency()) ? parseInt(self.proficiency()) : 0;
        return level ? Math.ceil(level / 4) + 1 + proficiency : proficiency;
    });

    self._proficiencyLabelDummy = ko.observable(null);

    /**
     * Reevaluate all computed variables.
     */
    self.updateValues = function() {
        self._proficiencyLabelDummy.valueHasMutated();
    };


    self.clear = function() {
        var values = new OtherStats().exportValues();
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.importValues = function(values) {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.exportValues = function() {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        return ko.mapping.toJS(self, mapping);
    };

    self.save = function() {
        self.ps.save();
    };
}

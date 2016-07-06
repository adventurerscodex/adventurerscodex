'use strict';

function OtherStats() {
    var self = this;
    self.ps = PersistenceService.register(OtherStats, self);
    self.mapping = { ignore: ['ps', 'mapping', 'importValues', 'exportValues',
        'clear', 'save', 'passiveWisdom', 'updateValues', 'passiveWisdomTooltip',
        'msg', '_passiveWisdomDummy']
    };

    self.characterId = ko.observable(null);
    self.ac = ko.observable(10);
    self.initiative = ko.observable(0);
    self.speed = ko.observable(0);
    self.inspiration = ko.observable(0);
    self.proficiency = ko.observable(0);
    self.level = ko.observable(0);
    self.experience = ko.observable(0);

    var msg = 'Calculated Value:  10 + your perception bonus';
    self.passiveWisdomTooltip = ko.observable(msg);

  /**
   * Calculates passive wisdom based on the formula:
   * 10 + Perception Skill Bonus.
   */
    self.passiveWisdom = ko.pureComputed(function() {
        self._passiveWisdomDummy();
        var key = CharacterManager.activeCharacter().key();
        var perceptionSkill = Skill.findAllByKeyAndName(key, 'perception');
        return 10 + perceptionSkill[0].bonus();
    });

    self._passiveWisdomDummy = ko.observable(null);

    /**
     * Reevaluate all computed variables.
     */
    self.updateValues = function() {
        self._passiveWisdomDummy.valueHasMutated();
    };


    self.clear = function() {
        var values = new OtherStats().exportValues();
        ko.mapping.fromJS(values, self.mapping, self);
    };

    self.importValues = function(values) {
        ko.mapping.fromJS(values, self.mapping, self);
    };

    self.exportValues = function() {
        return ko.mapping.toJS(self, self.mapping);
    };

    self.save = function() {
        self.ps.save();
    };
}

OtherStats.findBy = function(characterId) {
    return PersistenceService.findAll(OtherStats).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};

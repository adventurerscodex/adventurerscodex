"use strict";

function OtherStats() {
	var self = this;
	self.ps = PersistenceService.register(OtherStats, self);

	self.characterId = ko.observable(null);
	self.ac = ko.observable(10);
	self.initiative = ko.observable(0);
	self.speed = ko.observable(0);
	self.inspiration = ko.observable(0);
	self.proficiency = ko.observable(0);

  var msg = 'Calculated Value:  10 + your perception bonus'
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
		self.ac(10);
		self.initiative(0);
		self.speed(0);
		self.proficiency(0);
		self.inspiration(0);
	};

	self.importValues = function(values) {
    	self.characterId(values.characterId);
		self.ac(values.ac);
		self.initiative(values.initiative);
		self.speed(values.speed);
		self.inspiration(values.inspiration);
		self.proficiency(values.proficiency);
	};

	self.exportValues = function() {
		return {
        	characterId: self.characterId(),
			ac: self.ac(),
			initiative: self.initiative(),
			speed: self.speed(),
			inspiration: self.inspiration(),
			proficiency: self.proficiency()
		}
	};

	self.save = function() {
		self.ps.save();
	};
};

OtherStats.findBy = function(characterId) {
	return PersistenceService.findAll(OtherStats).filter(function(e, i, _) {
		return e.characterId() === characterId;
	});
};

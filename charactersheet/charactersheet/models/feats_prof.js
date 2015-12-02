"use strict;"

function FeatsProf() {
	var self = this;
	self.ps = PersistenceService.register(FeatsProf, self);

	self.characterId = ko.observable(null);
	self.feats = ko.observable('');
	self.proficiencies = ko.observable('');
	self.specialAbilities = ko.observable('');

	self.clear = function() {
		self.feats('');
    	self.proficiencies('');
    	self.specialAbilities('');
  	};
  	

	self.importValues = function(values) {
    	self.characterId(values.characterId);   	
		self.feats(values.feats);
		self.proficiencies(values.proficiencies);
		self.specialAbilities(values.specialAbilities);
	};

	self.exportValues = function() {
		return {
        	characterId: self.characterId(),
			feats: self.feats(),
			proficiencies: self.proficiencies(),
			specialAbilities: self.specialAbilities()
		}
	};  	

  	self.save = function() {
  		self.ps.save();
  	};

};

FeatsProf.findBy = function(characterId) {
	return PersistenceService.findAll(FeatsProf).filter(function(e, i, _) {
		return e.characterId() === characterId;
	});
};

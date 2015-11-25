"use strict;"

function FeatsProf() {
	var self = this;
	self.ps = PersistenceService.register(FeatsProf, self);

	self.feats = ko.observable('');
	self.proficiencies = ko.observable('');
	self.specialAbilities = ko.observable('');

	self.clear = function() {
		self.feats('');
    	self.proficiencies('');
    	self.specialAbilities('');
  	};
  	

	self.importValues = function(values) {
		self.feats(values.feats);
		self.proficiencies(values.proficiencies);
		self.specialAbilities(values.specialAbilities);
	};

	self.exportValues = function() {
		return {
			feats: self.feats(),
			proficiencies: self.proficiencies(),
			specialAbilities: self.specialAbilities()
		}
	};  	

  	self.save = function() {
  		self.ps.save();
  	};

};

FeatsProf.find = function() {
	return PersistenceService.findOne(FeatsProf);
};

function DeathSave() {
	var self = this;
	self.ps = PersistenceService.register(DeathSave, self);

	self.characterId = ko.observable(null);
	self.deathSaveSuccess = ko.observable(false);
	self.deathSaveFailure = ko.observable(false);

	self.clear = function() {
		self.deathSaveSuccess(false);
		self.deathSaveFailure(false);
	};

	self.importValues = function(values) {
    	self.characterId(values.characterId);
		self.deathSaveSuccess(values.deathSaveSuccess);
		self.deathSaveFailure(values.deathSaveFailure);
	};

	self.exportValues = function() {
		return {
        	characterId: self.characterId(),
			deathSaveSuccess: self.deathSaveSuccess(),
			deathSaveFailure: self.deathSaveFailure()
		}
	};

	self.save = function() {
		self.ps.save();
	};

	self.delete = function() {
		self.ps.delete();
	};
};

DeathSave.findAllBy = function(characterId) {
	return PersistenceService.findAll(DeathSave).filter(function(e, i, _) {
		return e.characterId() === characterId;
	});
};

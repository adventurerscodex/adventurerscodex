function HitDiceType() {
	var self = this;
	self.ps = PersistenceService.register(HitDiceType, self);

	self.characterId = ko.observable(null);
	self.hitDiceType = ko.observable('');
	self.hitDiceOptions = ko.observableArray(
        ['D4', 'D6', 'D8', 'D10', 'D12', 'D20']);

	self.clear = function() {
		self.hitDiceType('');
	};

	self.importValues = function(values) {
    	self.characterId(values.characterId);   	
		self.hitDiceType(values.hitDiceType);
	};
	
	self.exportValues = function() {
		return {
        	characterId: self.characterId(),
			hitDiceType: self.hitDiceType()
		}
	};
	
	self.save = function() {
		self.ps.save();
	};
	
	self.delete = function() {
		self.ps.delete();
	};
};

HitDiceType.findAllBy = function(characterId) {
	return PersistenceService.findAll(HitDiceType).filter(function(e, i, _) {
		return e.characterId() === characterId;
	});
};

function HitDice() {
	var self = this;
	self.ps = PersistenceService.register(HitDice, self);
	
	self.characterId = ko.observable(null);
	self.hitDiceType = ko.observable('');
	self.hitDiceUsed = ko.observable(false);
	
	self.clear = function() {
		self.hitDiceType('');
		self.hitDiceUsed(false);
	};
	
	self.importValues = function(values) {
    	self.characterId(values.characterId);   	
		self.hitDiceType(values.hitDiceType);
		self.hitDiceUsed(values.hitDiceUsed);
	};
	
	self.exportValues = function() {
		return {
        	characterId: self.characterId(),
			hitDiceType: self.hitDiceType(),
			hitDiceUsed: self.hitDiceUsed()
		}
	};
	
	self.save = function() {
		self.ps.save();
	};
	
	self.delete = function() {
		self.ps.delete();
	};
	
	self.toggleHitDice = function() {
		self.hitDiceUsed(!self.hitDiceUsed())
	};
	
	self.hitDiceIcon = ko.pureComputed(function() {
		var css = 'heart-full';
		if (self.hitDiceUsed()) {
			css = 'heart-empty';
		}
		return css;
	});
};

HitDice.findAllBy = function(characterId) {
	return PersistenceService.findAll(HitDice).filter(function(e, i, _) {
		return e.characterId() === characterId;
	});
};


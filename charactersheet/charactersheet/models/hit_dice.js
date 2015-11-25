function HitDice() {
	var self = this;
	self.ps = PersistenceService.register(HitDice, self);
	
	self.hitDiceType = ko.observable('');
	self.hitDiceUsed = ko.observable(false);
	
	self.clear = function() {
		self.hitDiceType('');
		self.hitDiceUsed(false);
	};
	
	self.importValues = function(values) {
		self.hitDiceType(values.hitDiceType);
		self.hitDiceUsed(values.hitDiceUsed);
	};
	
	self.exportValues = function() {
		return {
			hitDiceType: self.hitDiceType(),
			hitDiceUsed: self.hitDiceUsed()
		}
	};
	
	self.save = function() {
		self.ps.save();
	};
	
	self.toggleHitDice = function() {
		self.hitDiceUsed(!self.hitDiceUsed())
	};
	
	self.hitDiceIcon = ko.computed(function() {
		var css = 'heart-full';
		if (self.hitDiceUsed()) {
			css = 'heart-empty';
		}
		return css;
	});
};

HitDice.findAll = function() {
	return PersistenceService.findAll(HitDice);
};

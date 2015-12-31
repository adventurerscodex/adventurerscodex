function Health() {
	var self = this;
	self.ps = PersistenceService.register(Health, self);
	
	self.DANGER_THRESHOLD = 0.10;
	self.WARNING_THRESHOLD = 0.30;
	
	self.characterId = ko.observable(null);
	self.maxHitpoints = ko.observable(10);
	self.tempHitpoints = ko.observable(0);
	self.damage = ko.observable(0);
		
	self.hitpoints = ko.pureComputed(function() {
		if(self.maxHitpoints() && self.damage())
			return (parseInt(self.maxHitpoints()) + parseInt(self.tempHitpoints())) - parseInt(self.damage());
		else if(self.maxHitpoints() && !self.damage())
			return parseInt(self.maxHitpoints()) + parseInt(self.tempHitpoints());
		else
			return "";
	}, self);
	
	self.totalHitpoints = ko.pureComputed(function() {
		return (parseInt(self.maxHitpoints()) + parseInt(self.tempHitpoints()));
	}, self);
	
	self.tempHitpointsRemaining = ko.pureComputed(function() {
		return (parseInt(self.tempHitpoints()) - parseInt(self.damage()));
	}, self);
		
	self.regularHitpointsRemaining = ko.pureComputed(function() {
		if (self.tempHitpointsRemaining() > 0) {
			return parseInt(self.maxHitpoints())
		}
		return (parseInt(self.maxHitpoints()) - ((self.damage() ? parseInt(self.damage()) : 0) - parseInt(self.tempHitpoints())));
	}, self);

	//Progress bar methods.
		
	self.isKnockedOut =  ko.pureComputed(function() {
		return true ? parseInt(self.hitpoints()) / parseInt(self.totalHitpoints()) <= 0: false; 
	}, self);
		
	self.isDangerous = ko.pureComputed(function() {
		return true ? parseInt(self.hitpoints()) / parseInt(self.totalHitpoints()) < self.DANGER_THRESHOLD : false; 
	}, self);
	
	self.isWarning = ko.pureComputed(function() {
		return true ? parseInt(self.hitpoints()) / parseInt(self.totalHitpoints()) < self.WARNING_THRESHOLD : false; 
	}, self);
	
	self.progressType = ko.pureComputed(function() {
		var type = 'progress-bar-success';
		if (self.isWarning()) type = 'progress-bar-warning';
		if (self.isDangerous()) type = 'progress-bar-danger';
		return type;
	}, self);
	
	self.regularProgressWidth = ko.pureComputed(function() {
		if (self.isKnockedOut()) {
			return '100%';
		}
		return (parseInt(self.regularHitpointsRemaining()) / parseInt(self.totalHitpoints()) * 100) + '%';
	}, self);

	self.tempProgressWidth = ko.pureComputed(function() {
		if (self.tempHitpointsRemaining() < 0) {
			return '0%';
		}
		return (parseInt(self.tempHitpointsRemaining()) / parseInt(self.totalHitpoints()) * 100) + '%';
	}, self);
	
	
	self.progressLabel = ko.pureComputed(function() {
		if (self.isKnockedOut()) {
			return 'K.O.';
		} 
		return '';
	}, self);
	
	self.clear = function() {
		self.maxHitpoints(0);
		self.tempHitpoints(0);
		self.damage(0);
	};
	
	self.importValues = function(values) {
    	self.characterId(values.characterId);   	
		self.maxHitpoints(values.maxHitpoints);
		self.tempHitpoints(values.tempHitpoints);
		self.damage(values.damage);
	};
	
	self.exportValues = function() {
		return {
        	characterId: self.characterId(),
			maxHitpoints: self.maxHitpoints(),
			tempHitpoints: self.tempHitpoints(),
			damage: self.damage()
		}
	};
	
	self.save = function() {
		self.ps.save();
	};
};

Health.findBy = function(characterId) {
	return PersistenceService.findAll(Health).filter(function(e,i,_) {
		return e.characterId() === characterId;
	});
};

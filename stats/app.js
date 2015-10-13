function Stats() {
	var self = this;

	self.health = new Health();

	self.clear = function() {
		self.health.clear();
	};
	
	self.importValues = function(values) {
		self.health.importValues(values.health);
	};
	
	self.exportValues = function() {
		return {
			health: self.health.exportValues()
		}
	};
};

function Health() {
	var self = this;
	self.DANGER_THRESHOLD = 0.10;
	self.WARNING_THRESHOLD = 0.30;
	
	self.maxHitpoints = ko.observable(10);
	self.tempHitpoints = ko.observable(0);
	self.damage = ko.observable(0);
		
	self.hitpoints = ko.computed(function() {
		return (parseInt(self.maxHitpoints()) + parseInt(self.tempHitpoints())) - parseInt(self.damage());
	}, self);
	
	self.totalHitpoints = ko.computed(function() {
		return (parseInt(self.maxHitpoints()) + parseInt(self.tempHitpoints()));
	}, self);
	
	self.tempHitpointsRemaining = ko.computed(function() {
		return (parseInt(self.tempHitpoints()) - parseInt(self.damage()));
	}, self);
		
	self.regularHitpointsRemaining = ko.computed(function() {
		if (self.tempHitpointsRemaining() > 0) {
			return parseInt(self.maxHitpoints())
		}
		return (parseInt(self.maxHitpoints()) - (parseInt(self.damage()) - parseInt(self.tempHitpoints())));
	}, self);

	//Progress bar methods.
		
	self.isKnockedOut =  ko.computed(function() {
		return true ? parseInt(self.hitpoints()) / parseInt(self.totalHitpoints()) <= 0: false; 
	}, self);
		
	self.isDangerous = ko.computed(function() {
		return true ? parseInt(self.hitpoints()) / parseInt(self.totalHitpoints()) < self.DANGER_THRESHOLD : false; 
	}, self);
	
	self.isWarning = ko.computed(function() {
		return true ? parseInt(self.hitpoints()) / parseInt(self.totalHitpoints()) < self.WARNING_THRESHOLD : false; 
	}, self);
	
	self.progressType = ko.computed(function() {
		var type = 'progress-bar-success';
		if (self.isWarning()) type = 'progress-bar-warning';
		if (self.isDangerous()) type = 'progress-bar-danger';
		return type;
	}, self);
	
	self.regularProgressWidth = ko.computed(function() {
		if (self.isKnockedOut()) {
			return '100%';
		}
		return (parseInt(self.regularHitpointsRemaining()) / parseInt(self.totalHitpoints()) * 100) + '%';
	}, self);

	self.tempProgressWidth = ko.computed(function() {
		if (self.tempHitpointsRemaining() < 0) {
			return '0%';
		}
		return (parseInt(self.tempHitpointsRemaining()) / parseInt(self.totalHitpoints()) * 100) + '%';
	}, self);
	
	
	self.progressLabel = ko.computed(function() {
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
		self.maxHitpoints(values.maxHitpoints);
		self.tempHitpoints(values.tempHitpoints);
		self.damage(values.damage);
	};
	
	self.exportValues = function() {
		return {
			maxHitpoints: self.maxHitpoints(),
			tempHitpoints: self.tempHitpoints(),
			damage: self.damage()
		}
	};
};

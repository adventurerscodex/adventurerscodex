function Stats() {
	this.health = new Health();

	this.clear = function() {
		this.health.clear();
	};
	
	this.importValues = function(values) {
		this.health.importValues(values.health);
	};
	
	this.exportValues = function() {
		return {
			health: this.health.exportValues()
		}
	};
};

function Health() {
	this.DANGER_THRESHOLD = 0.10;
	this.WARNING_THRESHOLD = 0.30;
	
	this.maxHitpoints = ko.observable(10, { persist: 'stats.health.maxHitpoints' });
	this.tempHitpoints = ko.observable(0, { persist: 'stats.health.tempHitpoints' });
	this.damage = ko.observable(0, { persist: 'stats.health.damage' });
		
	this.hitpoints = ko.computed(function() {
		return (parseInt(this.maxHitpoints()) + parseInt(this.tempHitpoints())) - parseInt(this.damage());
	}, this);
	
	this.totalHitpoints = ko.computed(function() {
		return (parseInt(this.maxHitpoints()) + parseInt(this.tempHitpoints()));
	}, this);
	
	this.tempHitpointsRemaining = ko.computed(function() {
		return (parseInt(this.tempHitpoints()) - parseInt(this.damage()));
	}, this);
		
	this.regularHitpointsRemaining = ko.computed(function() {
		if (this.tempHitpointsRemaining() > 0) {
			return parseInt(this.maxHitpoints())
		}
		return (parseInt(this.maxHitpoints()) - (parseInt(this.damage()) - parseInt(this.tempHitpoints())));
	}, this);

	//Progress bar methods.
		
	this.isKnockedOut =  ko.computed(function() {
		return true ? parseInt(this.hitpoints()) / parseInt(this.totalHitpoints()) <= 0: false; 
	}, this);
		
	this.isDangerous = ko.computed(function() {
		return true ? parseInt(this.hitpoints()) / parseInt(this.totalHitpoints()) < this.DANGER_THRESHOLD : false; 
	}, this);
	
	this.isWarning = ko.computed(function() {
		return true ? parseInt(this.hitpoints()) / parseInt(this.totalHitpoints()) < this.WARNING_THRESHOLD : false; 
	}, this);
	
	this.progressType = ko.computed(function() {
		var type = 'progress-bar-success';
		if (this.isWarning()) type = 'progress-bar-warning';
		if (this.isDangerous()) type = 'progress-bar-danger';
		return type;
	}, this);
	
	this.regularProgressWidth = ko.computed(function() {
		if (this.isKnockedOut()) {
			return '100%';
		}
		return (parseInt(this.regularHitpointsRemaining()) / parseInt(this.totalHitpoints()) * 100) + '%';
	}, this);

	this.tempProgressWidth = ko.computed(function() {
		if (this.tempHitpointsRemaining() < 0) {
			return '0%';
		}
		return (parseInt(this.tempHitpointsRemaining()) / parseInt(this.totalHitpoints()) * 100) + '%';
	}, this);
	
	
	this.progressLabel = ko.computed(function() {
		if (this.isKnockedOut()) {
			return 'K.O.';
		} 
		return '';
	}, this);
	
	this.clear = function() {
		this.maxHitpoints(0);
		this.tempHitpoints(0);
		this.damage(0);
	};
	
	this.importValues = function(values) {
		this.maxHitpoints(values.maxHitpoints);
		this.tempHitpoints(values.tempHitpoints);
		this.damage(values.damage);
	};
	
	this.exportValues = function() {
		return {
			maxHitpoints: this.maxHitpoints(),
			tempHitpoints: this.tempHitpoints(),
			damage: this.damage()
		}
	};
};

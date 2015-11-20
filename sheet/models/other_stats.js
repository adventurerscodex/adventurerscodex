function OtherStats() {
	var self = this;
	
	self.ac = ko.observable(10);
	self.initiative = ko.observable(0);
	self.speed = ko.observable(0);
	self.inspiration = ko.observable(0);
	self.proficiency = ko.observable(0);
	
	self.clear = function() {
		self.ac(10);
		self.initiative(0);
		self.speed(0);
		self.proficiency(0);
		self.inspiration(0);
	};
	
	self.importValues = function(values) {
		self.ac(values.ac);
		self.initiative(values.initiative);
		self.speed(values.speed);
		self.inspiration(values.inspiration);
		self.proficiency(values.proficiency);
	};
	
	self.exportValues = function() {
		return {
			ac: self.ac(),
			initiative: self.initiative(),
			speed: self.speed(),
			inspiration: self.inspiration(),
			proficiency: self.proficiency()
		}
	};
};

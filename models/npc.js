function NPC() {
	var self = this;

	self.profile = ko.observable(new Profile());
	self.appearance = ko.observable(new CharacterAppearance());
	self.health = ko.observable(new Health());
	self.otherStats = ko.observable(new OtherStats());
	self.abilityScores = ko.observable(new AbilityScores());
	self.equipment = ko.observableArray([]);
	self.treasure = ko.observable(new Treasure());
	self.notes = ko.observable(new Note());
	
	//self.actions = ko.observable(new Action());
      
	self.clear = function() {
		self.profile().clear();
		self.appearance().clear();
		self.abilityScores().clear();
		self.health().clear();
		self.equipment().clear();
		self.treasure().clear();
		self.notes().clear();
	};

	self.importValues = function(values) {
		self.profile().importValues(values.profile);
		self.appearance().importValues(values.appearance);
		self.health().importValues(values.health);
		//self.equipment().importValues(values.equipment);
		self.abilityScores().importValues(values.abilityScores);
		self.treasure().importValues(values.treasure);
		self.notes().importValues(values.notes);
	};

	self.exportValues = function() {
		return {
			profile: self.profile().exportValues(),
			appearance: self.appearance().exportValues(),
			health: self.health().exportValues(),
			abilityScores: self.abilityScores().exportValues(),
			//equipment: self.equipment().exportValues(),
			treasure: self.treasure().exportValues(),
			notes: self.notes().exportValues()
		};
	};
};

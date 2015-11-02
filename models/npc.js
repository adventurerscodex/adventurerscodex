function NPC() {
	var self = this;

	self.profile = ko.observable(new Profile());
	self.appearance = ko.observable(new CharacterAppearance());
	self.health = ko.observable(new Health());
	self.abilityScores = ko.observable(new AbilityScores());
	self.equipment = ko.observableArray([]);
	self.treasure = ko.observable(new Treasure());
      
	self.clear = function() {
		self.profile().clear();
		self.appearance().clear();
		self.abilityScores().clear();
		self.health().clear();
		self.equipment().clear();
		self.treasure().clear();
	};

	self.importValues = function(values) {
		self.profile().importValues(values.profile);
		self.appearance().importValues(values.appearance);
		self.health().importValues(values.health);
		self.equipment().importValues(values.equipment);
		self.abilityScores().importValues(values.abilityScores);
		self.treasure().importValues(values.treasure);
	};

	self.exportValues = function() {
		return {
			profile: self.profile().exportValues(),
			appearance: self.appearance().exportValues(),
			health: self.health().exportValues(),
			abilityScores: self.abilityScores().exportValues(),
			equipment: self.equipment().exportValues(),
			treasure: self.treasure().exportValues()
		};
	};
};

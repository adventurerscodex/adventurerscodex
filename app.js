function ViewModel() {
	var self = this;

	self.profile = ko.observable(new Profile());
	self.stats = ko.observable(new Stats());
	self.note = ko.observable(new Note());
    self.abilityScores = ko.observable(new abilityScores());
    self.spellSlots = ko.observable(new SpellSlots());
    self.spellbook = ko.observable(new Spellbook());
    self.skillTree = ko.observable(new SkillTree());
    self.treasure = ko.observable(new Treasure());

    self.clear = function() {
    	self.profile().clear();
    	self.note().clear();
    	self.abilityScores().clear();
    	self.stats().clear();
    	self.spellSlots().clear();
        self.spellbook().clear();
        self.treasure().clear();
    };
    
    self.pageTitle = ko.computed(function() {
    	return self.profile().characterName() + ' by ' + self.profile().playerName()
    		+ ' | Adventurer\'s Codex';
    });

    self.importValues = function(values) {
    	try {
			self.profile().importValues(values.profile);
			self.stats().importValues(values.stats);
			self.note().importValues(values.note);
			self.abilityScores().importValues(values.abilityScores);
			self.spellSlots().importValues(values.spellSlots);
            self.spellbook().importValues(values.spellbook);
            self.treasure().importValues(values.treasure);
		} catch(err) {
			console.log(err);
		}
    };

    self.exportValues = function() {
    	return {
    		profile: self.profile().exportValues(),
    		note: self.note().exportValues(),
    		stats: self.stats().exportValues(),
    		abilityScores: self.abilityScores().exportValues(),
    		spellSlots: self.spellSlots().exportValues(),
            spellbook: self.spellbook().exportValues(),
            treasure: self.treasure().exportValues()
    	};
    };

    self.save = function() {
    	var string = JSON.stringify(self.exportValues());
    	var filename = self.profile().characterName();
    	var blob = new Blob([string], {type: "application/json"});
		saveAs(blob, filename);
    };

    self.saveToFile = function() {
    	var string = JSON.stringify(self.exportValues());
    	var filename = self.profile().characterName();
    	var blob = new Blob([string], {type: "application/json"});
		saveAs(blob, filename);
    };
};

/**
 * Do preflight checks. 
 * - Has the user been here before? 
 * - Do they have a character? Etc.
 */
init = function() {
	checkFirstTime();
};

checkFirstTime = function() {
	if (localStorage['character.characterKeys'] === undefined 
			|| eval(localStorage['character.characterKeys']).length < 1) {
		window.location = '/characters'
	}
};

function ViewModel() {
	var self = this;

	self.profileViewModel = ko.observable(new ProfileViewModel());
	self.stats = ko.observable(new Stats());
	self.backpack = ko.observable(new Backpack());
	self.note = ko.observable(new Note());
    self.abilityScores = ko.observable(new abilityScores());
    self.spellSlotsViewModel = ko.observable(new SpellSlotsViewModel());
    self.spellbook = ko.observable(new Spellbook());
    self.skillTree = ko.observable(new SkillTree());
    self.treasure = ko.observable(new Treasure());
    self.featsProf = ko.observable(new FeatsProfViewModel());

    self.clear = function() {
    	self.profileViewModel().clear();
    	self.note().clear();
    	self.abilityScores().clear();
    	self.stats().clear();
    	self.backpack().clear();
    	self.spellSlotsViewModel().clear();
        self.spellbook().clear();
        self.treasure().clear();
        self.featsProf().clear();
    };

    self.pageTitle = ko.computed(function() {
    	return self.profileViewModel().characterName() + ' by ' + self.profileViewModel().playerName()
    		+ ' | Adventurer\'s Codex';
    });

    self.importValues = function(values) {
    	try {
			self.profileViewModel().importValues(values.profileViewModel);
			self.stats().importValues(values.stats);
			self.note().importValues(values.note);
			self.backpack().importValues(values.backpack);
			self.abilityScores().importValues(values.abilityScores);
			self.spellSlotsViewModel().importValues(values.spellSlotsViewModel);
            self.spellbook().importValues(values.spellbook);
            self.treasure().importValues(values.treasure);
            self.featsProf().importValues(values.feats_prof);
		} catch(err) {
			console.log(err);
		}
    };

    self.exportValues = function() {
    	return {
    		profileViewModel: self.profileViewModel().exportValues(),
    		note: self.note().exportValues(),
    		backpack: self.backpack().exportValues(),
    		stats: self.stats().exportValues(),
    		abilityScores: self.abilityScores().exportValues(),
    		spellSlotsViewModel: self.spellSlotsViewModel().exportValues(),
            spellbook: self.spellbook().exportValues(),
            treasure: self.treasure().exportValues(),
            feats_prof: self.featsProf().exportValues()
    	};
    };

    self.save = function() {
    	var string = JSON.stringify(self.exportValues());
    	var filename = self.profileViewModel().characterName();
    	var blob = new Blob([string], {type: "application/json"});
		saveAs(blob, filename);
    };

    self.saveToFile = function() {
    	var string = JSON.stringify(self.exportValues());
    	var filename = self.profileViewModel().characterName();
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

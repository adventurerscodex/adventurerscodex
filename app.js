function ViewModel() {
	var self = this;

	self.profileViewModel = ko.observable(new ProfileViewModel());
	self.stats = ko.observable(new Stats());
	self.backpackViewModel = ko.observable(new BackpackViewModel(self));
	self.note = ko.observable(new Note());
    self.abilityScores = ko.observable(new abilityScores());
    self.featuresTraitsViewModel = ko.observable(new FeaturesTraitsViewModel());
    self.spellSlotsViewModel = ko.observable(new SpellSlotsViewModel());
    self.equipmentViewModel = ko.observable(new EquipmentViewModel(self));
    self.spellbook = ko.observable(new Spellbook());
    self.skillTree = ko.observable(new SkillTree());
    self.treasure = ko.observable(new Treasure());
    self.featsProf = ko.observable(new FeatsProfViewModel());

    self.clear = function() {
    	self.profileViewModel().clear();
    	self.note().clear();
    	self.abilityScores().clear();
    	self.stats().clear();
    	self.featuresTraitsViewModel().clear();
    	self.backpackViewModel().clear();
    	self.equipmentViewModel().clear();
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
			self.equipmentViewModel().importValues(values.equipmentViewModel);
			self.note().importValues(values.note);
			self.backpackViewModel().importValues(values.backpackViewModel);
			self.abilityScores().importValues(values.abilityScores);
			self.spellSlotsViewModel().importValues(values.spellSlotsViewModel);
	    	self.featuresTraitsViewModel().importValues(values.featuresTraitsViewModel);
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
    		backpackViewModel: self.backpackViewModel().exportValues(),
    		stats: self.stats().exportValues(),
    		abilityScores: self.abilityScores().exportValues(),
    		spellSlotsViewModel: self.spellSlotsViewModel().exportValues(),
<<<<<<< HEAD
<<<<<<< HEAD
 	    	featuresTraitsViewModel : self.featuresTraitsViewModel().exportValues(),
        	spellbook: self.spellbook().exportValues(),
=======
=======
>>>>>>> f6a8ea3723c7e98d22421e401af80832df988c69
    		equipmentViewModel: self.equipmentViewModel().exportValues(),
            spellbook: self.spellbook().exportValues(),
>>>>>>> Added equipment module and started breaking out models.
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

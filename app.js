function ViewModel() {
	var self = this;

	self.user = ko.observable(new User());
	self.stats = ko.observable(new Stats());
	self.note = ko.observable(new Note());
    self.abilityScores = ko.observable(new abilityScores());
    self.spellSlots = ko.observable(new SpellSlots());
    self.spellbook = ko.observable(new Spellbook());

    self.fileContents = ko.observable();
    self.fileReader = new FileReader();

    self.clear = function() {
    	self.user().clear();
    	self.note().clear();
    	self.abilityScores().clear();
    	self.stats().clear();
    	self.spellSlots().clear();
        self.spellbook().clear();
    };

    self.importValues = function(values) {
    	try {
			self.user().importValues(values.user);
			self.stats().importValues(values.stats);
			self.note().importValues(values.note);
			self.abilityScores().importValues(values.abilityScores);
			self.spellSlots().importValues(values.spellSlots);
            self.spellbook().importValues(values.spellbook);
		} catch(err) {
			console.log(err);
		}
    };

    self.exportValues = function() {
    	return {
    		user: self.user().exportValues(),
    		note: self.note().exportValues(),
    		stats: self.stats().exportValues(),
    		abilityScores: self.abilityScores().exportValues(),
    		spellSlots: self.spellSlots().exportValues(),
            spellbook: self.spellbook().exportValues()
    	};
    };

    self.importFromFile = function() {
        //The first comma in the result file string is the last
        //character in the string before the actual json data
        var length = self.fileReader.result.indexOf(",") + 1
        var values = JSON.parse(atob(self.fileReader.result.substring(
            length, self.fileReader.result.length)));
		self.importValues(values);
    };

    self.save = function() {
    	var string = JSON.stringify(self.exportValues());
    	var filename = self.user().characterName();
    	var blob = new Blob([string], {type: "application/json"});
		saveAs(blob, filename);
    };

    self.saveToFile = function() {
    	var string = JSON.stringify(self.exportValues());
    	var filename = self.user().characterName();
    	var blob = new Blob([string], {type: "application/json"});
		saveAs(blob, filename);
    };
};

function ViewModel() {
	var self = this;

	self.user = ko.observable(new User());
	self.stats = ko.observable(new Stats());
	self.note = ko.observable(new Note());
    self.abilityScores = ko.observable(new abilityScores());
    self.spellSlots = ko.observable(new SpellSlots());
    
    self.fileContents = ko.observable();
    self.fileReader = new FileReader();
        
    self.clear = function() {
    	self.user().clear();
    	self.note().clear();
    	self.abilityScores().clear();
    	self.stats().clear();
    	self.spellSlots().clear();
    };
    
    self.importValues = function() {
    	var values = self.fileReader.json;
    	try {
			self.user().importValues(values.user);
			self.stats().importValues(values.stats);
			self.note().importValues(values.note);
			self.abilityScores().importValues(values.abilityScores);
			self.spellSlots().importValues(values.spellSlots);
		} catch(err) {
			//Add error handling.
			console.log(err);
		}
    };

    this.exportValues = function() {
    	var string = JSON.stringify({
    		user: this.user().exportValues(),
    		note: this.note().exportValues(),
    		stats: this.stats().exportValues(),
    		abilityScores: this.abilityScores().exportValues(),
    		spellSlots: this.spellSlots().exportValues(),
            spellbook: this.spellbook().exportValues(),
    	});
    	var filename = self.user().characterName();
    	var blob = new Blob([string], {type: "application/json"});
		saveAs(blob, filename);
    };

    //File handling
    self.fileReader.onload = function() {
    	var l = 'data:application/json;base64,'.length
    	this.json = JSON.parse(atob(this.result.substring(l, this.result.length)));
    }
};

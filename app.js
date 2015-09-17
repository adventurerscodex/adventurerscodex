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
    
    self.importValues = function(values) {
    	try {
			self.user().importValues(values.user);
			self.stats().importValues(values.stats);
			self.note().importValues(values.note);
			self.abilityScores().importValues(values.abilityScores);
			self.spellSlots().importValues(values.spellSlots);
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
    	};
    };
    
    self.importFromFile = function() {
    	var values = self.fileReader.json;
		self.importValues(values);
    };
    
    self.save = function() {
    	var string = JSON.stringify(self.exportValues());
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

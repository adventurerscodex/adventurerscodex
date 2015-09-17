function ViewModel() {
	this.user = ko.observable(new User());
	this.stats = ko.observable(new Stats());
	this.note = ko.observable(new Note());
    this.abilityScores = ko.observable(new abilityScores());
    this.spellSlots = ko.observable(new SpellSlots());
    this.spellbook = ko.observable(new Spellbook());

    this.fileContents = ko.observable();
    this.fileReader = new FileReader();

    this.clear = function() {
    	this.user().clear();
    	this.note().clear();
    	this.abilityScores().clear();
    	this.stats().clear();
    	this.spellSlots().clear();
    };

    this.importValues = function() {
    	var values = this.fileReader.json;
    	try {
			this.user().importValues(values.user);
			this.stats().importValues(values.stats);
			this.note().importValues(values.note);
			this.abilityScores().importValues(values.abilityScores);
			this.spellSlots().importValues(values.spellSlots);
            this.spellbook().importValues(values.spellbook);
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
    	var filename = this.user().characterName();
    	var blob = new Blob([string], {type: "application/json"});
		saveAs(blob, filename);
    };

    //File handling
    this.fileReader.onload = function() {
    	var l = 'data:application/json;base64,'.length
    	this.json = JSON.parse(atob(this.result.substring(l, this.result.length)));
    }
};

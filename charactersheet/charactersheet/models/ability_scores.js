"use strict";

function AbilityScores() {
    var self = this;
    self.ps = PersistenceService.register(AbilityScores, self);
    
    self.characterId = ko.observable(null);

    self.str =  ko.observable(18);
    self.strModifier = ko.computed(function(){
      return getStrModifier(self.str());
    });

    self.dex =  ko.observable(18);
    self.dexModifier = ko.computed(function(){
      return getStrModifier(self.dex());
    });

    self.con =  ko.observable(18);
    self.conModifier = ko.computed(function(){
      return getStrModifier(self.con());
    });

    self.int =  ko.observable(18);
    self.intModifier = ko.computed(function(){
      return getStrModifier(self.int());
    });

    self.wis =  ko.observable(18);
    self.wisModifier = ko.computed(function(){
      return getStrModifier(self.wis());
    });

    self.cha =  ko.observable(18);
    self.chaModifier = ko.computed(function(){
      return getStrModifier(self.cha());
    });
        
    //Public Methods
    
    self.modifierFor = function(score) {
		var val = 0;
		switch(score.toLowerCase()) {
			case 'str':
				val = self.str();
				break;
			case'dex':
				val = self.dex();
				break;
			case'con':
				val = self.con();
				break;
			case'int':
				val = self.int();
				break;
			case'wis':
				val = self.wis();
				break;
			case'cha':
				val = self.cha();
				break;
		}
		return getModifier(val);
    };

    self.clear = function() {
        self.str(18);
        self.dex(18);
        self.con(18);
        self.int(18);
        self.wis(18);
        self.cha(18);
    };

    self.importValues = function(values) { 
    	self.characterId(values.characterId);   	
        self.str(values.str);
        self.dex(values.dex);
        self.con(values.con);
        self.int(values.int);
        self.wis(values.wis);
        self.cha(values.cha);
   };

    self.exportValues = function() {
        return {
        	characterId: self.characterId(),
            str: self.str(),
            dex: self.dex(),
            con: self.con(),
            int: self.int(),
            wis: self.wis(),
            cha: self.cha(),
        };
    };
    
    self.save = function() {
    	self.ps.save();
    	AbilityScoresSignaler.changed.dispatch();
    };
};

AbilityScores.findBy = function(characterId) {
	var r = PersistenceService.findOne(AbilityScores);
	if (!r) { r = []; }
	
	return $.map(r, function(e, _){
		if (e.characterId === characterId) { return e; }
	});
};

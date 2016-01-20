"use strict";

function AbilityScores() {
    var self = this;
    self.ps = PersistenceService.register(AbilityScores, self);

    self.characterId = ko.observable(null);

    self.str =  ko.observable(null);
    self.strModifier = ko.pureComputed(function(){
      return getStrModifier(self.str());
    });

    self.dex =  ko.observable(null);
    self.dexModifier = ko.pureComputed(function(){
      return getStrModifier(self.dex());
    });

    self.con =  ko.observable(null);
    self.conModifier = ko.pureComputed(function(){
      return getStrModifier(self.con());
    });

    self.int =  ko.observable(null);
    self.intModifier = ko.pureComputed(function(){
      return getStrModifier(self.int());
    });

    self.wis =  ko.observable(null);
    self.wisModifier = ko.pureComputed(function(){
      return getStrModifier(self.wis());
    });

    self.cha =  ko.observable(null);
    self.chaModifier = ko.pureComputed(function(){
      return getStrModifier(self.cha());
    });

    //Public Methods

    self.modifierFor = function(score) {
		var val = null;
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
        self.str(null);
        self.dex(null);
        self.con(null);
        self.int(null);
        self.wis(null);
        self.cha(null);
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
    };
};

AbilityScores.findBy = function(characterId) {
	return PersistenceService.findAll(AbilityScores).filter(function(e, i, _){
		return e.characterId() === characterId;
	});
};

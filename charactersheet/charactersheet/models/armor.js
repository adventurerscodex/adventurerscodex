"use strict";

function Armor() {
    var self = this;
    self.ps = PersistenceService.register(Armor, self);
	self.mapping = {
	    ignore: ['ps', 'mapping', 'importValues', 'exportValues', 'clear',
	        'save', 'delete', 'proficiencyLabel']
	};

    self.characterId = ko.observable(null);
    self.armorName = ko.observable('');
    self.armorType = ko.observable('');
    self.armorProficiency = ko.observable(false);
    self.armorPrice = ko.observable('');
	self.armorCurrencyDenomination = ko.observable('');
    self.armorWeight = ko.observable('');
    self.armorDexBonus = ko.observable('');
    self.armorCheckPenalty = ko.observable('');
    self.armorDescription = ko.observable('');
    self.armorTypeOptions = ko.observableArray(
        ['Light', 'Medium', 'Heavy', 'Shields']);

    self.proficiencyLabel = ko.pureComputed(function() {
        if (self.armorProficiency() === true) {
            return 'glyphicon glyphicon-ok';
        }
        return '';
    });

    self.clear = function() {
        var values = new Armor().exportValues();
        ko.mapping.fromJS(values, self.mapping, self);
    };

    self.importValues = function(values) {
        ko.mapping.fromJS(values, self.mapping, self);
    };

    self.exportValues = function() {
        return ko.mapping.toJS(self, self.mapping);
    };

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };
};

Armor.findAllBy =function(characterId) {
    return PersistenceService.findAll(Armor).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};

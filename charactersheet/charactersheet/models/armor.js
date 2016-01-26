"use strict";

function Armor() {
    var self = this;
    self.ps = PersistenceService.register(Armor, self);

    self.characterId = ko.observable(null);
    self.armorName = ko.observable('');
    self.armorType = ko.observable('');
    self.armorBonus = ko.observable('');
    self.armorProficiency = ko.observable(false);
    self.armorPrice = ko.observable('');
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
        self.armorName('');
        self.armorType('');
        self.armorBonus('');
        self.armorProficiency(false);
        self.armorPrice('');
        self.armorWeight('');
        self.armorDexBonus('');
        self.armorCheckPenalty('');
        self.armorDescription('');
    };

    self.importValues = function(values) {
        self.characterId(values.characterId);
        self.armorName(values.armorName);
        self.armorType(values.armorType);
        self.armorBonus(values.armorBonus);
        self.armorProficiency(values.armorProficiency);
        self.armorPrice(values.armorPrice);
        self.armorWeight(values.armorWeight);
        self.armorDexBonus(values.armorDexBonus);
        self.armorCheckPenalty(values.armorCheckPenalty);
        self.armorDescription(values.armorDescription);
    };

    self.exportValues = function() {
        return {
            characterId: self.characterId(),
            armorName: self.armorName(),
            armorType: self.armorType(),
            armorBonus: self.armorBonus(),
            armorProficiency: self.armorProficiency(),
            armorPrice: self.armorPrice(),
            armorWeight: self.armorWeight(),
            armorDexBonus: self.armorDexBonus(),
            armorCheckPenalty: self.armorCheckPenalty(),
            armorDescription: self.armorDescription()
        }
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

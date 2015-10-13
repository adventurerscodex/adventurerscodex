"use strict";

function Spellbook() {
    var self = this;
    self.selecteditem = ko.observable();
    self.blankSpell = ko.observable(new Spell());
    self.spellbook = ko.observableArray([]);

    self.addSpell = function() {
        self.spellbook.push(self.blankSpell());
        self.blankSpell(new Spell());
    };

    self.removeSpell = function(spell) { self.spellbook.remove(spell) };

    self.editSpell = function(spell) {
        self.selecteditem(spell);
    };

    self.exportValues = function() {
        var spells = [];
        for (var i in self.spellbook()) {
            var spell = self.spellbook()[i];
            spells.push(spell.exportValues());
        }
        return {
            spellbook: spells
        }
    };

    self.importValues = function(values) {
        var newSpells = []
        for (var i in values.spellbook) {
            var spell = values.spellbook[i];
            var newSpell = new Spell();
            newSpell.importValues(spell);
            self.spellbook.push(newSpell);
        }
    };

    self.clear = function() {
        self.spellbook([]);
    };
};

function Spell() {
    var self = this;

    self.spellName = ko.observable('');
    self.spellType = ko.observable('');
    self.spellDmg = ko.observable('');
    self.spellSchool = ko.observable('');
    self.spellLevel = ko.observable(0);
    self.spellDescription = ko.observable('');
    self.spellCastingTime = ko.observable('');
    self.spellRange = ko.observable('');
    self.spellComponents = ko.observable('');
    self.spellDuration = ko.observable('');

    this.clear = function() {
        self.spellName('');
        self.spellType('');
        self.spellDmg('');
        self.spellSchool('');
        self.spellLevel('');
        self.spellDescription('');
        self.spellCastingTime('');
        self.spellRange('');
        self.spellComponents('');
        self.spellDuration('');
    };

    this.importValues = function(values) {
        self.spellName(values.spellName);
        self.spellType(values.spellType);
        self.spellDmg(values.spellDmg);
        self.spellSchool(values.spellSchool);
        self.spellLevel(values.spellLevel);
        self.spellDescription(values.spellDescription);
        self.spellCastingTime(values.spellCastingTime);
        self.spellRange(values.spellRange);
        self.spellComponents(values.spellComponents);
        self.spellDuration(values.spellDuration);
    };

    this.exportValues = function() {
        return {
        spellName: self.spellName(),
        spellType: self.spellType(),
        spellDmg: self.spellDmg(),
        spellSchool: self.spellSchool(),
        spellLevel: self.spellLevel(),
        spellDescription: self.spellDescription(),
        spellCastingTime: self.spellCastingTime(),
        spellRange: self.spellRange(),
        spellComponents: self.spellComponents(),
        spellDuration: self.spellDuration(),
        }
    };
};

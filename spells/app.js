"use strict";

function Spellbook() {
    var self = this;
    self.selecteditem = ko.observable();
    self.blankSpell = ko.observable(new Spell('', '', '', '',
                                              '', '', '', '', '', '', function(){}));
    self.spellbook = ko.observableArray([], {
        persist: 'spells.spellbook',
        mapping: function(values){
            return new Spell(values.spellName, values.spellType, values.spellDmg, values.spellSchool,
                             values.spellLevel, values.spellDescription,
                             values.spellCastingTime, values.spellRange,
                             values.spellComponents, values.spellDuration,
                             function() {self.spellbook.valueHasMutated();});
        }
    });

    self.addSpell = function() {
        self.spellbook.push(self.blankSpell());
        self.blankSpell(new Spell('', '', '', '', '', '', '', '', '', '', function() {
                self.spellbook.valueHasMutated();
            }));
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
            spells: spells
        }
    };

    self.importValues = function(values) {
        var newSpells = []
        for (var i in values.spells) {
            var spell = values.spells[i];
            var newSpell = new Spell('', '', '', '',
                                              '', '', '', '', '', '', function(){});
            newSpell.importValues(spell);
            self.spellbook.push(newSpell);
        }
    };

    self.clear = function() {
        self.spellbook([]);
    };
};

function Spell(name, type, dmg, school, level, desc,
               time, range, components,
               duration, callback) {
    var self = this;

    self.spellName = ko.observable(name);
    self.spellName.subscribe(callback);

    self.spellType = ko.observable(type);
    self.spellType.subscribe(callback);

    self.spellDmg = ko.observable(dmg);
    self.spellDmg.subscribe(callback);

    self.spellSchool = ko.observable(school);
    self.spellSchool.subscribe(callback);

    self.spellLevel = ko.observable(level);
    self.spellLevel.subscribe(callback);

    self.spellDescription = ko.observable(desc);
    self.spellDescription.subscribe(callback);

    self.spellCastingTime = ko.observable(time);
    self.spellCastingTime.subscribe(callback);

    self.spellRange = ko.observable(range);
    self.spellRange.subscribe(callback);

    self.spellComponents = ko.observable(components);
    self.spellComponents.subscribe(callback);

    self.spellDuration = ko.observable(duration);
    self.spellDuration.subscribe(callback);

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
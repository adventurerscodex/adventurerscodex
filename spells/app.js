"use strict";

function Spellbook() {
    var self = this;
    self.selecteditem = ko.observable();
    self.blankSpell = ko.observable(new Spell('', '', '', '',
                                              '', '', '', '', function(){}));
    self.spellbook = ko.observableArray([], {
        persist: 'spells.spellbook',
        mapping: function(values){
            return new Spell(values.spellName, values.spellSchool,
                             values.spellLevel, values.spellDescription,
                             values.spellCastingTime, values.spellRange,
                             values.spellComponents, values.spellDuration,
                             function() {self.spellbook.valueHasMutated();});
        }
    });

    self.addSpell = function() {
        self.spellbook.push(self.blankSpell());
        self.blankSpell(new Spell('', '', '', '', '', '', '', '', function() {
                self.spellbook.valueHasMutated();
            }));
    };

    self.removeSpell = function(spell) { self.spellbook.remove(spell) };

    self.editSpell = function(spell) {
        self.selecteditem(spell);
    };
};

function Spell(name, school, level, desc,
               time, range, components,
               duration, callback) {
    var self = this;

    self.spellName = ko.observable(name);
    self.spellName.subscribe(callback);

    self.spellSchool = ko.observable(school);
    self.spellSchool.subscribe(callback);

    self.spellLevel = ko.observable(level);
    self.spellSchool.subscribe(callback);

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
};
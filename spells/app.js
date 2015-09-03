"use strict";

function Spellbook() {
    var self = this;
    self.selecteditem = ko.observable();
    self.blankSpell = ko.observable(new Spell('', '', '', '', function(){}));
    self.spellbook = ko.observableArray([], {
        persist: 'spells.spellbook',
        mapping: function(values){
            return new Spell(values.spellName, values.spellSchool,
                values.spellLevel, values.spellDescription, function() {
                self.spellbook.valueHasMutated();
            });
        }
    });

    self.addSpell = function() {
        self.spellbook.push(self.blankSpell());
        self.blankSpell(new Spell('', '', '', '', function() {
                self.spellbook.valueHasMutated();
            }));
    };

    self.removeSpell = function(spell) { self.spellbook.remove(spell) };

    self.editSpell = function(spell) {
        self.selecteditem(spell);
    };
};

function Spell(name, school, level, desc, callback) {
    var self = this;

    self.spellName = ko.observable(name);
    self.spellName.subscribe(callback);

    self.spellSchool = ko.observable(school);
    self.spellSchool.subscribe(callback);

    self.spellLevel = ko.observable(level);
    self.spellSchool.subscribe(callback);

    self.spellDescription = ko.observable(desc);
    self.spellDescription.subscribe(callback);
};
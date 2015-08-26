function Spellbook() {
    var self = this;
    self.spellbook = ko.observableArray([]);
    self.blankSpell = ko.observable(new Spell());

    this.addSpell = function() {
        self.spellbook.push(self.blankSpell());
        self.blankSpell(new Spell());
    };

    self.removeSpell = function(spell) { self.spellbook.remove(spell) }

};

function Spell() {
    var self = this;

    self.spellName = ko.observable('');
    self.spellSchool = ko.observable('');
    self.spellLevel = ko.observable('');
    self.spellDescription = ko.observable('');
};
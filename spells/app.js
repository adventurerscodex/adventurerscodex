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
    self.spellName.subscribe(callback);

    self.spellSchool = ko.observable('');
    self.spellSchool.subscribe(callback);

    self.spellLevel = ko.observable('');
    self.spellSchool.subscribe(callback);

    self.spellDescription = ko.observable('');
    self.spellDescription.subscribe(callback);
};
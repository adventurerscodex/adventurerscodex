'use strict';

function Spell() {
    var self = this;
    self.ps = PersistenceService.register(Spell, self);
    self.mapping = {
        ignore: ['clear', 'ps', 'importValues', 'exportValues', 'save',
            'spellDamageLabel', 'delete', 'mapping']
    };

    self.characterId = ko.observable(null);
    self.spellName = ko.observable('');
    self.spellPrepared = ko.observable(false);
    self.spellType = ko.observable('');
    self.spellSaveAttr = ko.observable('');
    self.spellDmg = ko.observable('');
    self.spellSchool = ko.observable('');
    self.spellLevel = ko.observable(1);
    self.spellDescription = ko.observable('');
    self.spellCastingTime = ko.observable('');
    self.spellRange = ko.observable('');
    self.spellComponents = ko.observable('');
    self.spellDuration = ko.observable('');
    self.spellTypeOptions = ko.observableArray(Fixtures.spell.spellTypeOptions);
    self.spellSaveAttrOptions = ko.observableArray(Fixtures.spell.spellSaveAttrOptions);
    self.spellSchoolOptions = ko.observableArray(Fixtures.spell.spellSchoolOptions);
    self.spellCastingTimeOptions = ko.observableArray(Fixtures.spell.spellCastingTimeOptions);
    self.spellDurationOptions = ko.observableArray(Fixtures.spell.spellDurationOptions);
    self.spellComponentsOptions = ko.observableArray(Fixtures.spell.spellComponentsOptions);
    self.spellRangeOptions = ko.observableArray(Fixtures.spell.spellRangeOptions);

    self.spellDamageLabel = ko.pureComputed(function() {
        var charKey = CharacterManager.activeCharacter().key();
        var spellBonus = SpellStats.findBy(charKey)[0].spellAttackBonus();
        if( self.spellType() === 'Attack' && spellBonus ){
            return (self.spellDmg() + ' [Spell Bonus: +' + spellBonus + ']');
        }
        else{
            return self.spellDmg();
        }
    });

    self.clear = function() {
        var values = new Spell().exportValues();
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
}

Spell.findAllBy =function(characterId) {
    return PersistenceService.findAll(Spell).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};

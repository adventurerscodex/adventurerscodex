'use strict';

function Slot() {
    var self = this;
    self.ps = PersistenceService.register(Slot, self);

    self.slotColors = Fixtures.general.colorList;

    self.characterId = ko.observable(null);
    self.level = ko.observable(1);
    self.maxSpellSlots = ko.observable(1);
    self.usedSpellSlots = ko.observable(0);
    self.resetsOn = ko.observable();

    self.color = ko.pureComputed(function() {
        return self.slotColors[self.level()-1];
    });

    self.spellSlots = ko.pureComputed(function() {
        return (parseInt(self.maxSpellSlots()) - parseInt(self.usedSpellSlots()));
    }, self);

    self.progressLabel = ko.pureComputed(function() {
        return (parseInt(self.maxSpellSlots()) - parseInt(self.usedSpellSlots())) + '/' + parseInt(self.maxSpellSlots());
    });

    self.progressWidth = ko.pureComputed(function() {
        return (parseInt(self.maxSpellSlots()) - parseInt(self.usedSpellSlots())) / parseInt(self.maxSpellSlots());
    });

    self.clear = function() {
        self.level(0);
        self.maxSpellSlots(0);
        self.usedSpellSlots(0);
    };

    self.importValues = function(values) {
        self.characterId(values.characterId);
        self.level(values.level);
        self.maxSpellSlots(values.maxSpellSlots);
        self.usedSpellSlots(values.usedSpellSlots);
        self.resetsOn(values.resetsOn);
    };

    self.exportValues = function() {
        return {
            characterId: self.characterId(),
            level: self.level(),
            maxSpellSlots: self.maxSpellSlots(),
            usedSpellSlots: self.usedSpellSlots(),
            resetsOn: self.resetsOn()
        };
    };

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };
}

Slot.findAllBy = function(characterId) {
    return PersistenceService.findAll(Slot).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};

Slot.REST_TYPE = {
    SHORT_REST: 'short',
    LONG_REST: 'long'
};

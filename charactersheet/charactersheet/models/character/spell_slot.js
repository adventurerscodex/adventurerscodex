import ko from 'knockout'

import { Fixtures } from 'charactersheet/utilities'
import { PersistenceService } from 'charactersheet/services/common'

export function Slot() {
    var self = this;
    self.ps = PersistenceService.register(Slot, self);
    self.mapping = {
        include: ['characterId', 'level', 'maxSpellSlots', 'usedSpellSlots', 'resetsOn']
    };

    self.slotColors = Fixtures.general.colorList;

    self.characterId = ko.observable(null);
    self.level = ko.observable(1);
    self.maxSpellSlots = ko.observable();
    self.usedSpellSlots = ko.observable(0);
    self.resetsOn = ko.observable('long');

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
        var values = new Slot().exportValues();
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.importValues = function(values) {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.exportValues = function() {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        return ko.mapping.toJS(self, mapping);
    };

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };
}

Slot.REST_TYPE = {
    SHORT_REST: 'short',
    LONG_REST: 'long'
};

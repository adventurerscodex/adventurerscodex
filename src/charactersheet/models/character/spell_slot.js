import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { Fixtures } from 'charactersheet/utilities';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';


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
        return self.getMaxSpellSlots() - self.getUsedSpellSlots();
    });

    self.progressWidth = ko.pureComputed(function() {
        return (self.getMaxSpellSlots() - self.getUsedSpellSlots()) / self.getMaxSpellSlots();
    });

    self.getMaxSpellSlots = function() {
        return self.maxSpellSlots() ? parseInt(self.maxSpellSlots()) : 0;
    };

    self.getUsedSpellSlots = function() {
        return self.usedSpellSlots() ? parseInt(self.usedSpellSlots()) : 0;
    };

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
Slot.__name = "Slot";

PersistenceService.addToRegistry(Slot);

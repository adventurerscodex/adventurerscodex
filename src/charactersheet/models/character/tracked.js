import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';


export function Tracked() {
    var self = this;

    self.ps = PersistenceService.register(Tracked, self);
    self.mapping = {
        include: ['characterId', 'trackedId', 'maxUses', 'used', 'resetsOn',
            'color', 'type']
    };

    self.characterId = ko.observable(null);
    self.trackedId = ko.observable(null);
    self.maxUses = ko.observable(0);
    self.used = ko.observable(0);
    self.resetsOn = ko.observable('long');
    self.color = ko.observable('');
    self.type = ko.observable(null);

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };

    self.clear = function() {
        var values = new Tracked().exportValues();
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
}
Tracked.__name = "Tracked";

PersistenceService.addToRegistry(Tracked);

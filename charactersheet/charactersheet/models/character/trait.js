import ko from 'knockout'
import 'knockout-mapping'

import 'bin/knockout-mapping-autoignore'

import { PersistenceService } from 'charactersheet/services/common/persistence_service'

export function Trait() {
    var self = this;

    self.ps = PersistenceService.register(Trait, self);
    self.mapping = {
        include: ['characterId', 'name', 'race', 'description', 'trackedId',
            'isTracked', 'tracked']
    };

    self.characterId = ko.observable(null);
    self.name = ko.observable('');
    self.race = ko.observable('');
    self.description = ko.observable('');
    self.trackedId = ko.observable(null);
    self.isTracked = ko.observable(false);
    self.tracked = ko.observable(null);

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };

    self.clear = function() {
        var values = new Trait().exportValues();
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


PersistenceService.addToRegistry(Trait);

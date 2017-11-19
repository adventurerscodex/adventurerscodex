import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';

export function Environment() {
    var self = this;
    self.ps = PersistenceService.register(Environment, self);
    self.mapping = {
        include: ['characterId', 'encounterId', 'imageUrl', 'weather',
            'terrain', 'description', 'isExhibited']
    };

    self.characterId = ko.observable();
    self.encounterId = ko.observable();

    self.imageUrl = ko.observable();
    self.weather = ko.observable();
    self.terrain = ko.observable();
    self.description = ko.observable();
    self.isExhibited = ko.observable(false);

    //Public Methods

    self.toJSON = function() {
        return { name: 'Environment', url: self.imageUrl() };
    };

    self.clear = function() {
        var values = new Environment().exportValues();
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

    self.name = ko.pureComputed(function() {
        return 'Weather: {weather}, Terrain: {terrain}'.replace(
            '{weather}', self.weather() ? self.weather() : 'Unknown'
        ).replace(
            '{terrain}', self.terrain() ? self.terrain() : 'Unknown'

        );
    });

    self.toHTML = function() {
        return 'New environment';
    };
}


PersistenceService.addToRegistry(Environment);

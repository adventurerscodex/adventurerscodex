'use strict';

function Feature() {
    var self = this;

    self.ps = PersistenceService.register(Feature, self);
    self.mapping = {
        include: ['characterId', 'name', 'description', 'trackedId', 'isTracked']
    };

    self.characterId = ko.observable(null);
    self.name = ko.observable('');
    self.description = ko.observable('');
    self.trackedId = ko.observable(null);
    self.isTracked = ko.observable(false);

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };

    self.clear = function() {
        var values = new Feature().exportValues();
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
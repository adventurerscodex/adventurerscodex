'use strict';

function EnvironmentSection() {
    var self = this;
    self.ps = PersistenceService.register(EnvironmentSection, self);
    self.mapping = {
        include: ['characterId', 'encounterId', 'visible']
    };

    // General Encounter Properties.
    self.characterId = ko.observable();
    self.encounterId = ko.observable();
    self.name = ko.observable('Environment');
    self.tagline = ko.observable('Where is this encounter, and what\'s it like there?');
    self.visible = ko.observable(false);

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };

    self.clear = function() {
        var values = new EnvironmentSection().exportValues();
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

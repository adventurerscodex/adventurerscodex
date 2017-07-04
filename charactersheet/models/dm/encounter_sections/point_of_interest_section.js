'use strict';

function PointOfInterestSection() {
    var self = this;
    self.ps = PersistenceService.register(PointOfInterestSection, self);
    self.mapping = {
        include: ['characterId', 'encounterId', 'visible', 'name']
    };

    self.characterId = ko.observable();
    self.encounterId = ko.observable();
    self.name = ko.observable('Points of Interest');
    self.visible = ko.observable(false);
    self.tagline = ko.observable('Keep track of all of the interesting locations and objects in the world.');

    //Public Methods

    self.clear = function() {
        var values = new PointOfInterestSection().exportValues();
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

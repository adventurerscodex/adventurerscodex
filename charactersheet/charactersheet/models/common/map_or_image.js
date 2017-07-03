'use strict';

function MapOrImage() {
    var self = this;

    self.ps = PersistenceService.register(MapOrImage, self);
    self.mapping = {
        include: ['characterId', 'encounterId', 'name', 'imageUrl', 'description']
    };

    self.characterId = ko.observable();
    self.encounterId = ko.observable();
    self.name = ko.observable();
    self.description = ko.observable();
    self.imageUrl = ko.observable();

    self.DESCRIPTION_MAX_LENGTH = 100;

    // Public Methods

    self.clear = function() {
        var values = new Map().exportValues();
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

    self.shortDescription = ko.pureComputed(function() {
        return Utility.string.truncateStringAtLength(self.description(), self.DESCRIPTION_MAX_LENGTH);
    });

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };

    /* Message Methods */

    self.toJSON = function() {
        return { image: self.imageUrl(), name: self.name() };
    };

    self.toHTML = function() {
        return 'New image';
    };
}

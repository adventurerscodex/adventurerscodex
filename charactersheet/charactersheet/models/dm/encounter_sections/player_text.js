'use strict';

function PlayerText() {
    var self = this;
    self.ps = PersistenceService.register(PlayerText, self);
    self.mapping = {
        include: ['characterId', 'encounterId', 'description']
    };

    self.characterId = ko.observable();
    self.encounterId = ko.observable();
    self.description = ko.observable();

    //Public Methods

    self.clear = function() {
        var values = new PlayerText().exportValues();
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

    // UI Methods

    self.longDescription = ko.pureComputed(function() {
        return Utility.markdown.asPlaintext(self.description()).substr(0, 200).trim() + '...';
    });

    self.shortDescription = ko.pureComputed(function() {
        return Utility.markdown.asPlaintext(self.description()).substr(0, 100).trim() + '...';
    });
}

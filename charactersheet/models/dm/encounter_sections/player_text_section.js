'use strict';

function PlayerTextSection() {
    var self = this;
    self.ps = PersistenceService.register(PlayerTextSection, self);
    self.mapping = {
        include: ['characterId', 'encounterId', 'visible', 'name']
    };

    self.characterId = ko.observable();
    self.encounterId = ko.observable();
    self.name = ko.observable('Read-Aloud Text');
    self.visible = ko.observable(true);
    self.tagline = ko.observable('For all the things you need to say to players: wall carvings, secret messages, or worldly descriptions.');

    //Public Methods

    self.clear = function() {
        var values = new PlayerTextSection().exportValues();
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

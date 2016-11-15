'use strict';

function PlayerImage() {
    var self = this;
    self.ps = PersistenceService.register(PlayerImage, self);

    self.mapping = {
        include: ['characterId', 'imageSource']
    };

    self.characterId = ko.observable(null);
    self.imageSource = ko.observable();

    self.clear = function() {
        var values = new AbilityScores().exportValues();
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
}

'use strict';

function FeaturesTraits() {
    var self = this;
    self.ps = PersistenceService.register(FeaturesTraits, self);
    self.mapping = {
        ignore: ['clear', 'ps', 'importValues', 'exportValues', 'save',
                'mapping']
    };

    self.characterId = ko.observable(null);
    self.background = ko.observable('');
    self.ideals = ko.observable('');
    self.flaws = ko.observable('');
    self.bonds = ko.observable('');

    self.save = function() {
        self.ps.save();
    };

    self.clear = function() {
        var values = new FeaturesTraits().exportValues();
        ko.mapping.fromJS(values, self.mapping, self);
    };

    self.importValues = function(values) {
        ko.mapping.fromJS(values, self.mapping, self);
    };

    self.exportValues = function() {
        return ko.mapping.toJS(self, self.mapping);
    };
}

FeaturesTraits.findBy = function(characterId) {
    return PersistenceService.findAll(FeaturesTraits).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};

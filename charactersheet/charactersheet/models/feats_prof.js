'use strict';

function FeatsProf() {
    var self = this;
    self.ps = PersistenceService.register(FeatsProf, self);
    self.mapping = {
        ignore: ['clear', 'ps', 'importValues', 'exportValues', 'save',
                'mapping']
    };

    self.characterId = ko.observable(null);
    self.feats = ko.observable('');
    self.proficiencies = ko.observable('');
    self.specialAbilities = ko.observable('');

    self.clear = function() {
        var values = new FeatsProf().exportValues();
        ko.mapping.fromJS(values, self.mapping, self);
    };

    self.importValues = function(values) {
        ko.mapping.fromJS(values, self.mapping, self);
    };

    self.exportValues = function() {
        return ko.mapping.toJS(self, self.mapping);
    };

    self.save = function() {
        self.ps.save();
    };
}

FeatsProf.findBy = function(characterId) {
    return PersistenceService.findAll(FeatsProf).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};

'use strict';

function FeatsProf() {
    var self = this;
    self.ps = PersistenceService.register(FeatsProf, self);
    self.mapping = {
        include: ['characterId', 'feats', 'proficiencies', 'specialAbilities']
    };

    self.characterId = ko.observable(null);
    self.feats = ko.observable('');
    self.proficiencies = ko.observable('');
    self.specialAbilities = ko.observable('');

    self.clear = function() {
        var values = new FeatsProf().exportValues();
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

FeatsProf.findBy = function(characterId) {
    return PersistenceService.findAll(FeatsProf).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};

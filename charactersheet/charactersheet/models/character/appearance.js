'use strict';

function CharacterAppearance() {
    var self = this;
    self.ps = PersistenceService.register(CharacterAppearance, self);
    self.mapping = {
        ignore: ['ps', 'mapping', 'importValues', 'exportValues', 'clear',
            'save']
    };

    self.characterId = ko.observable(null);
    self.height = ko.observable('');
    self.weight = ko.observable('');
    self.hairColor = ko.observable('');
    self.eyeColor = ko.observable('');
    self.skinColor = ko.observable('');

    //Public Methods

    self.clear = function() {
        var values = new CharacterAppearance().exportValues();
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

//CRUD

CharacterAppearance.findBy = function(characterId) {
    return PersistenceService.findAll(CharacterAppearance).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};


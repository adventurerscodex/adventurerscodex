'use strict';

function Profile() {
    var self = this;
    self.ps = PersistenceService.register(Profile, self);
    self.mapping = {
        ignore: ['clear', 'ps', 'importValues', 'exportValues', 'save',
            'characterSummary', 'mapping'],
        include: ['background']
    };

    self.characterId = ko.observable(null);
    self.characterName =  ko.observable('');
    self.background = ko.observable('');
    self.playerName = ko.observable('');
    self.race = ko.observable('');
    self.religion = ko.observable('');
    self.alignment = ko.observable('');
    self.diety = ko.observable('');
    self.typeClass = ko.observable('');
    self.gender = ko.observable('');
    self.age = ko.observable('');
    self.level = ko.observable('');
    self.exp = ko.observable('');

    //Public Methods

    self.characterSummary = ko.pureComputed(function() {
        var desc = ((self.race() && self.race() !== '') &&
                        (self.typeClass() && self.typeClass() !== '') &&
                        (self.level() && self.level() !== '')) ?
                    'A level ' + self.level() + ' ' + self.race() + ' ' + self.typeClass() + ' by '
                        + self.playerName() : false;
        desc = desc || 'A unique character, handcrafted from the finest bits the '
            + 'internet can provide.';
        return desc;
    });

    self.save = function() {
        self.ps.save();
    };

    self.clear = function() {
        var values = new Profile().exportValues();
        ko.mapping.fromJS(values, self.mapping, self);
    };

    self.importValues = function(values) {
        ko.mapping.fromJS(values, self.mapping, self);
    };

    self.exportValues = function() {
        return ko.mapping.toJS(self, self.mapping);
    };
}

Profile.findBy = function(characterId) {
    return PersistenceService.findAll(Profile).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};

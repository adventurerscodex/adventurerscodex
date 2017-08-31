'use strict';

import ko from 'knockout'

import { CharacterAppearance } from 'charactersheet/models'
import { PersistenceService } from 'charactersheet/services/common'

export function CharacterAppearance() {
    var self = this;
    self.ps = PersistenceService.register(CharacterAppearance, self);
    self.mapping = {
        include: ['characterId', 'height', 'weight', 'hairColor', 'eyeColor',
            'skinColor']
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

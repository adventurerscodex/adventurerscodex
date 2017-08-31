'use strict';

import ko from 'knockout'

import { FeaturesTraits } from 'charactersheet/models'
import { PersistenceService } from 'charactersheet/services/common'

export function FeaturesTraits() {
    var self = this;
    self.ps = PersistenceService.register(FeaturesTraits, self);
    self.mapping = {
        include: ['characterId', 'background', 'ideals', 'flaws', 'bonds']
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
}

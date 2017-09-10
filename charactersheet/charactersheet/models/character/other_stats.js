import ko from 'knockout'

import { PersistenceService } from 'charactersheet/services/common'

export function OtherStats() {
    var self = this;
    self.ps = PersistenceService.register(OtherStats, self);
    self.mapping = {
        include: ['characterId', 'armorClassModifier', 'initiative', 'speed',
        'inspiration', 'proficiency']
    };

    self.characterId = ko.observable(null);
    self.armorClassModifier = ko.observable(0);
    self.initiative = ko.observable(0);
    self.speed = ko.observable(0);
    self.inspiration = ko.observable(0);
    self.proficiency = ko.observable(0);

    self.clear = function() {
        var values = new OtherStats().exportValues();
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

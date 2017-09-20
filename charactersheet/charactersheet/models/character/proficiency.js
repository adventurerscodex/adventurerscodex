import ko from 'knockout'
import 'knockout-mapping'

import 'bin/knockout-mapping-autoignore'

import { PersistenceService } from 'charactersheet/services/common'
import { Fixtures } from 'charactersheet/utilities'


export function Proficiency() {
    var self = this;

    self.ps = PersistenceService.register(Proficiency, self);
    self.mapping = {
        include: ['characterId', 'name', 'type', 'description']
    };

    self.characterId = ko.observable(null);
    self.name = ko.observable('');
    self.type = ko.observable('');
    self.description = ko.observable('');
    self.proficiencyType = Fixtures.proficiency.proficiencyTypes;

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };

    self.clear = function() {
        var values = new Proficiency().exportValues();
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

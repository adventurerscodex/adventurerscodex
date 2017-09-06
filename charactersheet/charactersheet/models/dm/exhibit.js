'use strict';

import ko from 'knockout'

import { PersistenceService } from 'charactersheet/services'

export function Exhibit() {
    var self = this;
    self.ps = PersistenceService.register(Exhibit, self);
    self.mapping = {
        include: ['characterId', 'name', 'url']
    };

    self.characterId = ko.observable();
    self.name = ko.observable();
    self.url = ko.observable();

    self.toJSON = function() {
        return { name: self.name(), url: self.url() };
    };

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };

    self.clear = function() {
        var values = new Exhibit().exportValues();
        ko.mapping.fromJS(values, self.mapping, self);
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

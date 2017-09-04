'use strict';

import ko from 'knockout'

import { PersistenceService } from 'charactersheet/services'
import { Utility } from 'charactersheet/utilities'

export function PlayerText() {
    var self = this;
    self.SHORT_DESCRIPTION_MAX_LENGTH = 100;
    self.LONG_DESCRIPTION_MAX_LENGTH = 200;

    self.ps = PersistenceService.register(PlayerText, self);
    self.mapping = {
        include: ['characterId', 'encounterId', 'name', 'description']
    };

    self.characterId = ko.observable();
    self.encounterId = ko.observable();
    self.name = ko.observable();
    self.description = ko.observable();

    //Public Methods

    self.clear = function() {
        var values = new PlayerText().exportValues();
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

    self.delete = function() {
        self.ps.delete();
    };

    // UI Methods

    self.longDescription = ko.pureComputed(function() {
        return Utility.string.truncateStringAtLength(self.description(), self.LONG_DESCRIPTION_MAX_LENGTH);
    });

    self.shortDescription = ko.pureComputed(function() {
        return Utility.string.truncateStringAtLength(self.description(), self.SHORT_DESCRIPTION_MAX_LENGTH);
    });

    // Message Serialization Methods

    self.toHTML = function() {
        var description = self.description() ? self.description() : '';
        var name = self.name() ? self.name() : '';
        return '<h3>{name}</h3>&nbsp;<p>{description}</p>'.replace(
            '{description}', marked(description)
        ).replace(
            '{name}', name
        );
    };
}

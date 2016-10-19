'use strict';

/**
 * A directory-like container with meta-data information about a container.
 */
function Encounter() {
    var self = this;
    self.ps = PersistenceService.register(Encounter, self);

    // General Encounter Properties.
    self.characterId = ko.observable();
    self.encounterId = ko.observable();
    self.name = ko.observable();
    self.locale = ko.observable();
    self.notes = ko.observable();

    // Related Encounter IDs
    self.parent = ko.observable();
    self.children = ko.observableArray([]);
}

'use strict';

/**
 * A directory-like container with meta-data information about a container.
 */
function CombatSection() {
    var self = this;
    self.ps = PersistenceService.register(CombatSection, self);

    // General Encounter Properties.
    self.characterId = ko.observable();
    self.encounterId = ko.observable();
}

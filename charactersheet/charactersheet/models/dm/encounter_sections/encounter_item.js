'use strict';

function EncounterItem() {
    var self = new Item();

    self.ps = PersistenceService.register(EncounterItem, self);
    self.mapping.include.push('encounterId');

    self.encounterId = ko.observable();

    self.nameLabel = ko.pureComputed(function() {
        return self.weaponName();
    });

    return self;
}

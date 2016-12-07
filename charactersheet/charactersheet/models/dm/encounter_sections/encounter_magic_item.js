'use strict';

function EncounterMagicItem() {
    var self = new MagicItem();

    self.ps = PersistenceService.register(EncounterMagicItem, self);
    self.mapping.include.push('encounterId');

    self.encounterId = ko.observable();

    self.nameLabel = ko.pureComputed(function() {
        return self.weaponName();
    });

    return self;
}

'use strict';

function EncounterWeapon() {
    var self = new Weapon();

    self.ps = PersistenceService.register(EncounterWeapon, self);
    self.mapping.include.push('encounterId');

    self.encounterId = ko.observable();

    self.nameLabel = ko.pureComputed(function() {
        return self.weaponName();
    });

    return self;
}

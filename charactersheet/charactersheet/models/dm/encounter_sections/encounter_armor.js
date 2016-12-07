'use strict';

function EncounterArmor() {
    var self = new Armor();

    self.ps = PersistenceService.register(EncounterArmor, self);
    self.mapping.include.push('encounterId');

    self.encounterId = ko.observable();

    self.nameLabel = ko.pureComputed(function() {
        return self.weaponName();
    });

    return self;
}

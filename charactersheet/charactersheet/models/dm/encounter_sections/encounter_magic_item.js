'use strict';

function EncounterMagicItem() {
    var self = new MagicItem();

    self.ps = PersistenceService.register(EncounterMagicItem, self);
    self.mapping.include.push('encounterId');
    self.mapping.include.push('treasureType');

    self.encounterId = ko.observable();
    self.treasureType = ko.observable();

    self.nameLabel = ko.pureComputed(function() {
        return self.magicItemName();
    });

    return self;
}

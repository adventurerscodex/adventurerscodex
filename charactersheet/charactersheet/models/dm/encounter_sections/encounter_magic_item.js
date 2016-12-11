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

    self.propertyLabel = ko.pureComputed(function() {
        return self.magicItemType() ? self.magicItemType() : '';
    });

    self.descriptionLabel = ko.pureComputed(function() {
        return self.shortDescription();
    });

    return self;
}

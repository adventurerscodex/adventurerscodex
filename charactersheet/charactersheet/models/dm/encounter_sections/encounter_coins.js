'use strict';

function EncounterCoins() {
    var self = new Treasure();

    self.ps = PersistenceService.register(EncounterCoins, self);
    self.mapping.include.push('encounterId');
    self.mapping.include.push('treasureType');

    self.encounterId = ko.observable();
    self.treasureType = ko.observable();

    self.nameLabel = ko.pureComputed(function() {
        return 'Coins';
    });

    self.propertyLabel = ko.pureComputed(function() {
        return 'N/A';
    });

    self.descriptionLabel = ko.pureComputed(function() {
        return self.worthInGold() ? self.worthInGold() + '(gp)' : '';
    });

    return self;
}

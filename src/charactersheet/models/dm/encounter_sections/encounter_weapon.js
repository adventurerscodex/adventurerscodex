import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { Utility } from 'charactersheet/utilities/convenience';
import { Weapon } from 'charactersheet/models/common';
import ko from 'knockout';


export function EncounterWeapon() {
    var self = new Weapon();
    self.SHORT_DESCRIPTION_MAX_LENGTH = 100;

    self.ps = PersistenceService.register(EncounterWeapon, self);
    self.mapping.include.push('encounterId');
    self.mapping.include.push('treasureType');

    self.encounterId = ko.observable();
    self.treasureType = ko.observable();

    self.nameLabel = ko.pureComputed(function() {
        return self.weaponName();
    });

    self.propertyLabel = ko.pureComputed(function() {
        return self.weaponDmg() ? self.weaponDmg() : '';
    });

    self.descriptionLabel = ko.pureComputed(function() {
        return self.shortDescription();
    });

    // UI Methods
    self.shortDescription = ko.pureComputed(function() {
        return Utility.string.truncateStringAtLength(self.weaponDescription(), self.SHORT_DESCRIPTION_MAX_LENGTH);
    });

    return self;
}
EncounterWeapon.__name = 'EncounterWeapon';

PersistenceService.addToRegistry(EncounterWeapon);

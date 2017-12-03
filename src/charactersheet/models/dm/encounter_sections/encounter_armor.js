import { Armor } from 'charactersheet/models/common';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';

export function EncounterArmor() {
    var self = new Armor();

    self.ps = PersistenceService.register(EncounterArmor, self);
    self.mapping.include.push('encounterId');
    self.mapping.include.push('treasureType');

    self.encounterId = ko.observable();
    self.treasureType = ko.observable();

    self.nameLabel = ko.pureComputed(function() {
        return self.armorName();
    });

    self.propertyLabel = ko.pureComputed(function() {
        return self.armorClass() ? self.acLabel() : '';
    });

    self.descriptionLabel = ko.pureComputed(function() {
        return self.armorDescription();
    });

    return self;
}
EncounterArmor.__name = 'EncounterArmor';

PersistenceService.addToRegistry(EncounterArmor);

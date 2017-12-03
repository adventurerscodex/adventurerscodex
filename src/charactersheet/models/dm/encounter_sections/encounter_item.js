import { Item } from 'charactersheet/models/common';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';


export function EncounterItem() {
    var self = new Item();

    self.ps = PersistenceService.register(EncounterItem, self);
    self.mapping.include.push('encounterId');
    self.mapping.include.push('treasureType');

    self.encounterId = ko.observable();
    self.treasureType = ko.observable();

    self.nameLabel = ko.pureComputed(function() {
        return self.itemName();
    });

    self.propertyLabel = ko.pureComputed(function() {
        return 'N/A';
    });

    self.descriptionLabel = ko.pureComputed(function() {
        return self.shortDescription();
    });

    return self;
}
EncounterItem.__name = "EncounterItem";

PersistenceService.addToRegistry(EncounterItem);

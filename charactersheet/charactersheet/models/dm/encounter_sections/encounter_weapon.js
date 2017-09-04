'use strict';

import ko from 'knockout'

import { Weapon,
    EncounterWeapon } from 'charactersheet/models'
import { PersistenceService } from 'charactersheet/services'

export function EncounterWeapon() {
    var self = new Weapon();

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
        return self.weaponDescription() ? self.weaponDescription() : '';
    });

    return self;
}

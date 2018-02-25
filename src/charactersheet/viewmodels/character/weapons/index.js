import 'bin/knockout-bootstrap-modal';
import {
    CharacterManager,
    DataRepository,
    Fixtures,
    Notifications,
    Utility } from 'charactersheet/utilities';
import {
    PersistenceService,
    SortService } from 'charactersheet/services/common';
import { Weapon } from 'charactersheet/models/common';
import ko from 'knockout';
import template from './index.html';

export function WeaponsViewModel() {
    var self = this;

    self.blankWeapon = ko.observable(new Weapon());
    self.weapons = ko.observableArray([]);
    self.modalOpen = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable(new Weapon());
    self.shouldShowDisclaimer = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');
    self.firstModalElementHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);
    self.currencyDenominationList = ko.observableArray(Fixtures.general.currencyDenominationList);

    self.sorts = {
        'weaponName asc': { field: 'weaponName', direction: 'asc'},
        'weaponName desc': { field: 'weaponName', direction: 'desc'},
        'totalBonus asc': { field: 'totalBonus', direction: 'asc', numeric: true},
        'totalBonus desc': { field: 'totalBonus', direction: 'desc', numeric: true},
        'weaponDmg asc': { field: 'weaponDmg', direction: 'asc'},
        'weaponDmg desc': { field: 'weaponDmg', direction: 'desc'},
        'weaponRange asc': { field: 'weaponRange', direction: 'asc'},
        'weaponRange desc': { field: 'weaponRange', direction: 'desc'},
        'weaponDamageType asc': { field: 'weaponDamageType', direction: 'asc'},
        'weaponDamageType desc': { field: 'weaponDamageType', direction: 'desc'},
        'weaponProperty asc': { field: 'weaponProperty', direction: 'asc'},
        'weaponProperty desc': { field: 'weaponProperty', direction: 'desc'},
        'weaponQuantity asc': { field: 'weaponQuantity', direction: 'asc'},
        'weaponQuantity desc': { field: 'weaponQuantity', direction: 'desc'}
    };

    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['weaponName asc']);

    self.load = function() {
        Notifications.global.save.add(self.save);

        var key = CharacterManager.activeCharacter().key();
        self.weapons(PersistenceService.findBy(Weapon, 'characterId', key));

        Notifications.abilityScores.changed.add(self.valueHasChanged);
        Notifications.stats.changed.add(self.valueHasChanged);
    };

    self.unload = function() {
        self.save();

        self.weapons([]);
        Notifications.abilityScores.changed.remove(self.valueHasChanged);
        Notifications.stats.changed.remove(self.valueHasChanged);
        Notifications.global.save.remove(self.save);
    };

    self.save = function() {
        self.weapons().forEach(function(e, i, _) {
            e.save();
        });
    };

    self.totalWeight = ko.pureComputed(function() {
        var weight = 0;
        if (self.weapons().length > 0) {
            self.weapons().forEach(function(e, i, _) {
                weight += e.weaponWeight() ? parseInt(e.weaponWeight()) : 0;
            });
        }
        return weight + ' (lbs)';
    });

    /* UI Methods */

    /**
     * Filters and sorts the weaponss for presentation in a table.
     */
    self.filteredAndSortedWeapons = ko.computed(function() {
        return SortService.sortAndFilter(self.weapons(), self.sort(), null);
    });

    /**
     * Determines whether a column should have an up/down/no arrow for sorting.
     */
    self.sortArrow = function(columnName) {
        return SortService.sortArrow(columnName, self.sort());
    };

    /**
     * Given a column name, determine the current sort type & order.
     */
    self.sortBy = function(columnName) {
        self.sort(SortService.sortForName(self.sort(),
            columnName, self.sorts));
    };

    // Prepopulate methods

    self.populateWeapon = function(label, value) {
        var weapon = DataRepository.weapons[label];

        self.blankWeapon().importValues(weapon);
        self.shouldShowDisclaimer(true);
    };

    self.setWeaponType = function(label, value) {
        self.blankWeapon().weaponType(value);
    };

    self.setWeaponHandedness = function(label, value) {
        self.blankWeapon().weaponHandedness(value);
    };

    self.setWeaponProficiency = function(label, value) {
        self.blankWeapon().weaponProficiency(value);
    };

    self.setWeaponCurrencyDenomination = function(label, value) {
        self.blankWeapon().weaponCurrencyDenomination(value);
    };

    self.setWeaponDamageType = function(label, value) {
        self.blankWeapon().weaponDamageType(value);
    };

    self.setWeaponProperty = function(label, value) {
        self.blankWeapon().weaponProperty(value);
    };

    /* Modal Methods */

    self.modalFinishedOpening = function() {
        self.shouldShowDisclaimer(false);
        self.firstModalElementHasFocus(true);
    };

    self.modalFinishedClosing = function() {
        self.previewTabStatus('active');
        self.editTabStatus('');
        if (self.modalOpen()) {
            Utility.array.updateElement(self.weapons(), self.currentEditItem(), self.editItemIndex);
        }

        // Just in case data was changed.
        self.save();

        self.modalOpen(false);
        Notifications.weapon.changed.dispatch();
    };

    self.selectPreviewTab = function() {
        self.previewTabStatus('active');
        self.editTabStatus('');
    };

    self.selectEditTab = function() {
        self.editTabStatus('active');
        self.previewTabStatus('');
        self.editFirstModalElementHasFocus(true);
    };

    self.weaponsPrePopFilter = function(request, response) {
        var term = request.term.toLowerCase();
        var keys = DataRepository.weapons ? Object.keys(DataRepository.weapons) : [];
        var results = keys.filter(function(name, idx, _) {
            return name.toLowerCase().indexOf(term) > -1;
        });
        response(results);
    };

    //Manipulating weapons
    self.addWeapon = function() {
        var weapon = self.blankWeapon();
        weapon.characterId(CharacterManager.activeCharacter().key());
        weapon.save();
        self.weapons.push(weapon);
        self.blankWeapon(new Weapon());
        Notifications.weapon.changed.dispatch();
    };

    self.removeWeapon = function(weapon) {
        self.weapons.remove(weapon);
        weapon.delete();
        Notifications.weapon.changed.dispatch();
    };

    self.editWeapon = function(weapon) {
        self.editItemIndex = weapon.__id;
        self.currentEditItem(new Weapon());
        self.currentEditItem().importValues(weapon.exportValues());
        self.modalOpen(true);
    };

    self.clear = function() {
        self.weapons([]);
        Notifications.weapon.changed.dispatch();
    };

    self.valueHasChanged = function() {
        self.weapons().forEach(function(e, i, _) {
            e.updateValues();
        });
        Notifications.weapon.changed.dispatch();
    };
}

ko.components.register('weapons', {
    viewModel: WeaponsViewModel,
    template: template
});
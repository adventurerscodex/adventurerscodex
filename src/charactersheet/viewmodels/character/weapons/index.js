import 'bin/knockout-bootstrap-modal';
import {
    CoreManager,
    DataRepository,
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { SortService } from 'charactersheet/services/common';
import { Weapon } from 'charactersheet/models/common';
import ko from 'knockout';
import template from './index.html';

export function WeaponsViewModel() {
    var self = this;

    self.blankWeapon = ko.observable(new Weapon());
    self.weapons = ko.observableArray([]);
    self.modalOpen = ko.observable(false);
    self.addFormIsValid = ko.observable(false);
    self.addModalOpen = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable(new Weapon());
    self.shouldShowDisclaimer = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');
    self.firstModalElementHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);
    self.currencyDenominationList = ko.observableArray(Fixtures.general.currencyDenominationList);

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc'},
        'name desc': { field: 'name', direction: 'desc'},
        'totalBonus asc': { field: 'totalBonus', direction: 'asc', numeric: true},
        'totalBonus desc': { field: 'totalBonus', direction: 'desc', numeric: true},
        'damage asc': { field: 'damage', direction: 'asc'},
        'damage desc': { field: 'damage', direction: 'desc'},
        'range asc': { field: 'range', direction: 'asc'},
        'range desc': { field: 'range', direction: 'desc'},
        'damageType asc': { field: 'damageType', direction: 'asc'},
        'damageType desc': { field: 'damageType', direction: 'desc'},
        'property asc': { field: 'property', direction: 'asc'},
        'property desc': { field: 'property', direction: 'desc'},
        'quantity asc': { field: 'quantity', direction: 'asc'},
        'quantity desc': { field: 'quantity', direction: 'desc'}
    };

    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['name asc']);

    self.load = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await Weapon.ps.list({coreUuid: key});
        self.weapons(response.objects);
        self.weapons().forEach(function(e, i, _) {
            e.updateHitBonusLabel();
        });

        Notifications.abilityScores.changed.add(self.valueHasChanged);
        Notifications.stats.changed.add(self.valueHasChanged);
        Notifications.proficiencyBonus.changed.add(self.valueHasChanged);
    };

    self.totalWeight = ko.pureComputed(() => {
        var weight = 0;
        if (self.weapons().length > 0) {
            self.weapons().forEach(function(e, i, _) {
                weight += e.weight() ? parseInt(e.weight()) : 0;
            });
        }
        return weight + ' (lbs)';
    });

    /* UI Methods */

    /**
     * Filters and sorts the weapons for presentation in a table.
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

    // Pre-populate methods

    self.populateWeapon = function(label, value) {
        var weapon = DataRepository.weapons[label];

        self.blankWeapon().importValues(weapon);
        self.shouldShowDisclaimer(true);
    };

    self.setWeaponType = function(label, value) {
        self.blankWeapon().type(value);
    };

    self.setWeaponHandedness = function(label, value) {
        self.blankWeapon().handedness(value);
    };

    self.setWeaponProficiency = function(label, value) {
        self.blankWeapon().proficiency(value);
    };

    self.setWeaponCurrencyDenomination = function(label, value) {
        self.blankWeapon().currencyDenomination(value);
    };

    self.setWeaponDamageType = function(label, value) {
        self.blankWeapon().damageType(value);
    };

    self.setWeaponProperty = function(label, value) {
        self.blankWeapon().property(value);
    };

    /* Modal Methods */

    self.validation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.addWeapon();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...Weapon.validationConstraints
    };

    self.updateValidation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.modalFinishedClosing();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...Weapon.validationConstraints
    };

    self.toggleAddModal = () => {
        self.addModalOpen(!self.addModalOpen());
    };

    self.closeEditModal = () => {
        self.modalOpen(false);
        self.selectPreviewTab();
    };

    self.modalFinishedOpening = function() {
        self.shouldShowDisclaimer(false);
        self.firstModalElementHasFocus(true);
    };

    self.modalFinishedClosing = async () => {
        self.previewTabStatus('active');
        self.editTabStatus('');
        if (self.modalOpen()) {
            const response = await self.currentEditItem().ps.save();
            Utility.array.updateElement(self.weapons(), response.object, self.editItemIndex);
            self.updateWeaponCalculations(self.editItemIndex());
        }

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
    self.addWeapon = async () => {
        var weapon = self.blankWeapon();
        weapon.coreUuid(CoreManager.activeCore().uuid());
        const newWeapon = await weapon.ps.create();
        self.weapons.push(newWeapon.object);
        self.updateWeaponCalculations(newWeapon.object.uuid());
        self.blankWeapon(new Weapon());
        self.addModalOpen(false);
        Notifications.weapon.changed.dispatch();
    };

    self.closeAddModal = () => {
        self.addModalOpen(false);
    };

    self.removeWeapon = async (weapon) => {
        await weapon.ps.delete();
        self.weapons.remove(weapon);
        Notifications.weapon.changed.dispatch();
    };

    self.editWeapon = function(weapon) {
        self.editItemIndex = weapon.uuid;
        self.currentEditItem(new Weapon());
        self.currentEditItem().importValues(weapon.exportValues());
        self.modalOpen(true);
    };

    self.valueHasChanged = function() {
        self.weapons().forEach(function(e, i, _) {
            e.updateHitBonusLabel();
        });
        Notifications.weapon.changed.dispatch();
    };

    self.updateWeaponCalculations = (itemId) => {
        let weapon = self.weapons().filter((item) => {
            return item.uuid() === itemId;
        })[0];
        weapon.updateHitBonusLabel();
    };
}

ko.components.register('weapons', {
    viewModel: WeaponsViewModel,
    template: template
});

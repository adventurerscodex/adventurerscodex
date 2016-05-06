'use strict';

function WeaponsViewModel() {
    var self = this;

    self.selecteditem = ko.observable();
    self.blankWeapon = ko.observable(new Weapon());
    self.weapons = ko.observableArray([]);
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
        'weaponProperty desc': { field: 'weaponProperty', direction: 'desc'}
    };

    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['weaponName asc']);

    self.init = function() {

    };

    self.load = function() {
        var key = CharacterManager.activeCharacter().key();
        self.weapons(Weapon.findAllBy(key));

        Notifications.abilityScores.changed.add(self.valueHasChanged);
        Notifications.stats.changed.add(self.valueHasChanged);
    };

    self.unload = function() {
        $.each(self.weapons(), function(_, e) {
            e.save();
        });

        self.weapons([]);
        Notifications.abilityScores.changed.remove(self.valueHasChanged);
        Notifications.stats.changed.remove(self.valueHasChanged);
    };
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

    //Manipulating weapons
    self.addWeapon = function() {
        var weapon = self.blankWeapon();
        weapon.characterId(CharacterManager.activeCharacter().key());
        weapon.save();
        self.weapons.push(weapon);
        self.blankWeapon(new Weapon());
    };

    self.removeWeapon = function(weapon) {
        self.weapons.remove(weapon);
        weapon.delete();
    };

    self.editWeapon = function(weapon) {
        self.selecteditem(weapon);
    };

    self.clear = function() {
        self.weapons([]);
    };
    self.valueHasChanged = function() {
        self.weapons().forEach(function(e, i, _) {
            e.updateValues();
        });
    };
}

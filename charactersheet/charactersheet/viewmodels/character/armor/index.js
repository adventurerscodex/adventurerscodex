'use strict';

import ko from 'knockout'
//TODO Import

function ArmorViewModel() {
    var self = this;

    self.blankArmor = ko.observable(new Armor());
    self.armors = ko.observableArray([]);
    self.modalOpen = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable();
    self.shouldShowDisclaimer = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');
    self.firstModalElementHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);
    self.currencyDenominationList = ko.observableArray(Fixtures.general.currencyDenominationList);

    self.sorts = {
        'armorName asc': { field: 'armorName', direction: 'asc'},
        'armorName desc': { field: 'armorName', direction: 'desc'},
        'armorType asc': { field: 'armorType', direction: 'asc'},
        'armorType desc': { field: 'armorType', direction: 'desc'}
    };

    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['armorName asc']);

    self.load = function() {
        Notifications.global.save.add(self.save);
        self.armors.subscribe(function() {
            Notifications.armor.changed.dispatch();
        });

        var key = CharacterManager.activeCharacter().key();
        self.armors(PersistenceService.findBy(Armor, 'characterId', key));

        //Subscriptions
        Notifications.abilityScores.changed.add(self.valueHasChanged);
    };

    self.unload = function() {
        self.save();
        Notifications.abilityScores.changed.remove(self.valueHasChanged);
        Notifications.global.save.remove(self.save);
    };

    self.save = function() {
        self.armors().forEach(function(e, i, _) {
            e.save();
        });
    };

    self.armorEquippedLabel = function(armor) {
        return armor.armorEquipped() ? 'fa fa-check' : '';
    };

    self.totalWeight = ko.pureComputed(function() {
        var weight = 0;
        if(self.armors().length > 0) {
            self.armors().forEach(function(armor, idx, _) {
                weight += armor.armorWeight() ? parseInt(armor.armorWeight()) : 0;
            });
        }
        return weight + ' (lbs)';
    });

    self.equipArmorHandler = function(selectedItem, index) {
        if (selectedItem.armorEquipped()) {
            if (selectedItem.armorType() === 'Shield') {
                ko.utils.arrayForEach(self.armors(), function(item2) {
                    if (index != item2.__id && item2.armorType() == 'Shield') {
                        item2.armorEquipped('');
                    }
                });
            } else {
                ko.utils.arrayForEach(self.armors(), function(item2) {
                    if (index != item2.__id && item2.armorType() != 'Shield') {
                        item2.armorEquipped('');
                    }
                });
            }
        }
    };

    /* Modal Methods */

    self.armorsPrePopFilter = function(request, response) {
        var term = request.term.toLowerCase();
        var keys = DataRepository.armors ? Object.keys(DataRepository.armors) : [];
        var results = keys.filter(function(name, idx, _) {
            return name.toLowerCase().indexOf(term) > -1;
        });
        response(results);
    };

    self.populateArmor = function(label, value) {
        var armor = DataRepository.armors[label];

        self.blankArmor().importValues(armor);
        self.shouldShowDisclaimer(true);
    };

    self.modalFinishedOpening = function() {
        self.shouldShowDisclaimer(false);
        self.firstModalElementHasFocus(true);
    };

    self.modalFinishedClosing = function() {
        self.previewTabStatus('active');
        self.editTabStatus('');
        if (self.modalOpen()) {
            Utility.array.updateElement(self.armors(), self.currentEditItem(), self.editItemIndex);
        }

        self.equipArmorHandler(self.currentEditItem(), self.editItemIndex);

        self.save();
        self.modalOpen(false);
        Notifications.armor.changed.dispatch();
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

    self.modifierHasFocus = ko.observable(false);

    /**
     * Filters and sorts the armors for presentation in a table.
     */
    self.filteredAndSortedArmors = ko.computed(function() {
        return SortService.sortAndFilter(self.armors(), self.sort(), null);
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

    //Manipulating armors
    self.addArmor = function() {
        var armor = self.blankArmor();
        armor.characterId(CharacterManager.activeCharacter().key());
        armor.save();

        self.equipArmorHandler(armor, armor.__id);

        self.armors.push(armor);
        self.blankArmor(new Armor());
    };

    self.removeArmor = function(armor) {
        armor.delete();
        self.armors.remove(armor);
    };

    self.editArmor = function(armor) {
        self.editItemIndex = armor.__id;
        self.currentEditItem(new Armor());
        self.currentEditItem().importValues(armor.exportValues());
        self.modalOpen(true);
    };

    self.clear = function() {
        self.armors([]);
    };

    self.valueHasChanged = function() {
        self.armors().forEach(function(e, i, _) {
            e.updateValues();
        });
    };
}

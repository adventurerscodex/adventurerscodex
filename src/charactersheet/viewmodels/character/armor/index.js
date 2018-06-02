import 'bin/knockout-bootstrap-modal';
import {
    CoreManager,
    DataRepository,
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import {
    PersistenceService,
    SortService
} from 'charactersheet/services/common';
import { Armor } from 'charactersheet/models/common';
import ko from 'knockout';
import template from './index.html';

export function ArmorViewModel() {
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
        'equipped asc': { field: 'equipped', direction: 'asc', booleanType: true},
        'equipped desc': { field: 'equipped', direction: 'desc', booleanType: true},
        'name asc': { field: 'name', direction: 'asc'},
        'name desc': { field: 'name', direction: 'desc'},
        'type asc': { field: 'type', direction: 'asc'},
        'type desc': { field: 'type', direction: 'desc'},
        'armorClass asc': { field: 'armorClass', direction: 'asc', numeric: true},
        'armorClass desc': { field: 'armorClass', direction: 'desc', numeric: true}
    };

    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['name asc']);

    self.load = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await Armor.ps.list({coreUuid: key});
        self.armors(response.objects);

        //Subscriptions
        Notifications.abilityScores.changed.add(self.valueHasChanged);
    };

    self.armorEquippedLabel = function(armor) {
        return armor.equipped() ? 'fa fa-check' : '';
    };

    self.totalWeight = ko.pureComputed(function() {
        var weight = 0;
        if(self.armors().length > 0) {
            self.armors().forEach(function(armor, idx, _) {
                weight += armor.weight() ? parseInt(armor.weight()) : 0;
            });
        }
        return weight + ' (lbs)';
    });

    self.equipArmorHandler = (selectedItem, index) => {
        if (selectedItem.equipped()) {
            if (selectedItem.type() === 'Shield') {
                ko.utils.arrayForEach(self.armors(), async function(item2) {
                    if (index != item2.uuid && item2.type() == 'Shield') {
                        item2.equipped(false);
                        await item2.ps.save();
                    }
                });
            } else {
                ko.utils.arrayForEach(self.armors(), async function(item2) {
                    if (index != item2.uuid && item2.type() != 'Shield') {
                        item2.equipped(false);
                        await item2.ps.save();
                    }
                });
            }
        }
    };

    // Prepopulate methods

    self.setArmorType = function(label, value) {
        self.blankArmor().type(value);
    };

    self.setArmorCurrencyDenomination = function(label, value) {
        self.blankArmor().currencyDenomination(value);
    };

    self.setArmorStealth = function(label, value) {
        self.blankArmor().stealth(value);
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

    self.modalFinishedClosing = async () => {
        self.previewTabStatus('active');
        self.editTabStatus('');
        if (self.modalOpen()) {
            const response = await self.currentEditItem().ps.save();
            Utility.array.updateElement(self.armors(), response.object, self.editItemIndex);
            Notifications.armor.changed.dispatch();
        }

        self.equipArmorHandler(self.currentEditItem(), self.editItemIndex);
        self.modalOpen(false);
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
        self.sort(SortService.sortForName(self.sort(), columnName, self.sorts));
    };

    //Manipulating armors
    self.addArmor = async () => {
        var armor = self.blankArmor();
        armor.coreUuid(CoreManager.activeCore().uuid());
        const newArmor = await armor.ps.create();

        self.equipArmorHandler(newArmor.object, newArmor.object.uuid);
        self.armors.push(newArmor.object);
        self.blankArmor(new Armor());
        Notifications.armor.changed.dispatch();
    };

    self.removeArmor = async (armor) => {
        await armor.ps.delete();
        self.armors.remove(armor);
        Notifications.armor.changed.dispatch();
    };

    self.editArmor = function(armor) {
        self.editItemIndex = armor.uuid;
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

ko.components.register('armor', {
    viewModel: ArmorViewModel,
    template: template
});

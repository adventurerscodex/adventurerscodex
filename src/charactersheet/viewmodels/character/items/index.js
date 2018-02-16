import 'bin/knockout-bootstrap-modal';
import {
    CharacterManager,
    DataRepository,
    Fixtures,
    Utility
} from 'charactersheet/utilities';
import {
    PersistenceService,
    SortService
} from 'charactersheet/services/common';
import { Item } from 'charactersheet/models/common';
import { Notifications } from 'charactersheet/utilities';
import ko from 'knockout';
import template from './index.html';

export function ItemsViewModel() {
    var self = this;

    self.sorts = {
        'itemName asc': { field: 'itemName', direction: 'asc'},
        'itemName desc': { field: 'itemName', direction: 'desc'},
        'itemQty asc': { field: 'itemQty', direction: 'asc', numeric: true},
        'itemQty desc': { field: 'itemQty', direction: 'desc', numeric: true},
        'itemWeight asc': { field: 'itemWeight', direction: 'asc', numeric: true},
        'itemWeight desc': { field: 'itemWeight', direction: 'desc', numeric: true},
        'itemCost asc': { field: 'itemCost', direction: 'asc', numeric: true},
        'itemCost desc': { field: 'itemCost', direction: 'desc', numeric: true}
    };

    self.items = ko.observableArray([]);
    self.blankItem = ko.observable(new Item());
    self.modalOpen = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable();
    self.currencyDenominationList = ko.observableArray(Fixtures.general.currencyDenominationList);
    self.sort = ko.observable(self.sorts['itemName asc']);
    self.filter = ko.observable('');
    self.shouldShowDisclaimer = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');
    self.firstModalElementHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);

    self.totalItemWeight = ko.pureComputed(function() {
        var weightTotal = 0;
        var eqpLen = self.items().length;
        if (eqpLen > 0) {
            for (var i = 0; i < eqpLen; i++) {
                weightTotal += self.items()[i].totalWeight();
            }
            return weightTotal  + ' (lbs)';
        }
        else {
            return '0 (lbs)';
        }
    });

    //Responders
    self.load = function() {
        Notifications.global.save.add(self.save);

        var key = CharacterManager.activeCharacter().key();
        self.items(PersistenceService.findBy(Item, 'characterId', key));
    };

    self.unload = function() {
        self.save();
        Notifications.global.save.remove(self.save);
    };

    self.save = function() {
        self.items().forEach(function(e, i, _) {
            e.save();
        });
    };

    // Modal methods
    self.modalFinishedOpening = function() {
        self.shouldShowDisclaimer(false);
        self.firstModalElementHasFocus(true);
    };

    self.modalFinishedClosing = function() {
        self.previewTabStatus('active');
        self.editTabStatus('');
        self.previewTabStatus.valueHasMutated();
        self.editTabStatus.valueHasMutated();

        if (self.modalOpen()) {
            Utility.array.updateElement(self.items(), self.currentEditItem(), self.editItemIndex);
        }

        self.save();
        self.modalOpen(false);
        Notifications.item.changed.dispatch();
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

    /* UI Methods */

    /**
     * Filters and sorts the items for presentation in a table.
     */
    self.filteredAndSortedEquipment = ko.computed(function() {
        return SortService.sortAndFilter(self.items(), self.sort(), null);
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

    self.itemsPrePopFilter = function(request, response) {
        var term = request.term.toLowerCase();
        var keys = DataRepository.items ? Object.keys(DataRepository.items) : [];
        var results = keys.filter(function(name, idx, _) {
            return name.toLowerCase().indexOf(term) > -1;
        });
        response(results);
    };

    //Manipulating items
    self.removeItemButton = function(item) {
        self.removeItem(item);
    };

    self.addItemButton = function() {
        var item = new Item();
        item.importValues(self.blankItem().exportValues());
        self.addItem(item);
        self.blankItem().clear();
    };

    self.populateItem = function(label, value) {
        var item = DataRepository.items[label];

        self.blankItem().importValues(item);
        self.shouldShowDisclaimer(true);
    };

    //Public Methods

    self.addToItems = function(item) {
        self.addItem(item);
    };

    self.clear = function() {
        self.items([]);
    };

    //Private Methods

    self.addItem = function(item) {
        self.items.push(item);
        item.characterId(CharacterManager.activeCharacter().key());
        item.save();
        Notifications.item.changed.dispatch();
    };

    self.removeItem = function(item) {
        self.items.remove(item);
        item.delete();
        Notifications.item.changed.dispatch();
    };

    self.editItem = function(item) {
        self.editItemIndex = item.__id;
        self.currentEditItem(new Item());
        self.currentEditItem().importValues(item.exportValues());
        self.modalOpen(true);
    };
}

ko.components.register('items', {
    viewModel: ItemsViewModel,
    template: template
});

import 'bin/knockout-bootstrap-modal';
import {
    CoreManager,
    DataRepository,
    Fixtures,
    Utility
} from 'charactersheet/utilities';
import { SortService } from 'charactersheet/services/common';
import { Item } from 'charactersheet/models/common';
import { Notifications } from 'charactersheet/utilities';
import ko from 'knockout';
import template from './index.html';

export function ItemsViewModel() {
    var self = this;

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc'},
        'name desc': { field: 'name', direction: 'desc'},
        'quantity asc': { field: 'quantity', direction: 'asc', numeric: true},
        'quantity desc': { field: 'quantity', direction: 'desc', numeric: true},
        'weight asc': { field: 'weight', direction: 'asc', numeric: true},
        'weight desc': { field: 'weight', direction: 'desc', numeric: true},
        'cost asc': { field: 'cost', direction: 'asc', numeric: true},
        'cost desc': { field: 'cost', direction: 'desc', numeric: true}
    };

    self.items = ko.observableArray([]);
    self.blankItem = ko.observable(new Item());
    self.modalOpen = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable();
    self.currencyDenominationList = ko.observableArray(Fixtures.general.currencyDenominationList);
    self.sort = ko.observable(self.sorts['name asc']);
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
            return weightTotal + ' (lbs)';
        }
        else {
            return '0 (lbs)';
        }
    });

    //Responders
    self.load = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await Item.ps.list({coreUuid: key});
        self.items(response.objects);
    };

    // Prepopulate methods
    self.setItemCurrencyDenomination = function(label, value) {
        self.blankItem().currencyDenomination(value);
    };

    // Modal methods
    self.modalFinishedOpening = function() {
        self.shouldShowDisclaimer(false);
        self.firstModalElementHasFocus(true);
    };

    self.modalFinishedClosing = async() => {
        self.previewTabStatus('active');
        self.editTabStatus('');
        self.previewTabStatus.valueHasMutated();
        self.editTabStatus.valueHasMutated();

        if (self.modalOpen()) {
            const response = await self.currentEditItem().ps.save();
            Utility.array.updateElement(self.items(), response.object, self.editItemIndex);
            Notifications.item.changed.dispatch();
        }

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
    self.populateItem = function(label, value) {
        var item = DataRepository.items[label];

        self.blankItem().importValues(item);
        self.shouldShowDisclaimer(true);
    };

    //Public Methods

    self.clear = function() {
        self.items([]);
    };

    //Private Methods

    self.addItem = async() => {
        self.blankItem().coreUuid(CoreManager.activeCore().uuid());
        const newItem = await self.blankItem().ps.create();
        self.items.push(newItem.object);
        Notifications.item.changed.dispatch();
        self.blankItem(new Item());
    };

    self.removeItem = async(item) => {
        await item.ps.delete();
        self.items.remove(item);
        Notifications.item.changed.dispatch();
    };

    self.editItem = function(item) {
        self.editItemIndex = item.uuid;
        self.currentEditItem(new Item());
        self.currentEditItem().importValues(item.exportValues());
        self.modalOpen(true);
    };
}

ko.components.register('items', {
    viewModel: ItemsViewModel,
    template: template
});

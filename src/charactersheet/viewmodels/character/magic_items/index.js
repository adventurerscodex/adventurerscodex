import 'bin/knockout-bootstrap-modal';
import {
    CoreManager,
    DataRepository,
    Utility
} from 'charactersheet/utilities';
import { MagicItem } from 'charactersheet/models/common';
import { Notifications } from 'charactersheet/utilities';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { SortService } from 'charactersheet/services/common';
import ko from 'knockout';
import template from './index.html';

export function MagicItemsViewModel() {
    var self = this;

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc'},
        'name desc': { field: 'name', direction: 'desc'},
        'maxCharges asc': { field: 'maxCharges', direction: 'asc', numeric: true},
        'maxCharges desc': { field: 'maxCharges', direction: 'desc', numeric: true},
        'weight asc': { field: 'weight', direction: 'asc', numeric: true},
        'weight desc': { field: 'weight', direction: 'desc', numeric: true},
        'usedCharges asc': { field: 'usedCharges', direction: 'asc', numeric: true},
        'usedCharges desc': { field: 'usedCharges', direction: 'desc', numeric: true},
        'attuned asc': { field: 'attuned', direction: 'asc', booleanType: true},
        'attuned desc': { field: 'attuned', direction: 'desc', booleanType: true}
    };

    self.blankMagicItem = ko.observable(new MagicItem());
    self.magicItems = ko.observableArray([]);
    self.modalOpen = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable();
    self.shouldShowDisclaimer = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');
    self.firstModalElementHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);
    self.magicItemIconCSS = ko.observable('');

    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['name asc']);

    self.numberOfAttuned = ko.computed(function(){
        var attuned = ko.utils.arrayFilter(self.magicItems(), function(item) {
            return item.attuned() === true;
        });
        return attuned.length;
    });

    self.noneAttuned = ko.computed(function(){
        var numberAttuned = ko.utils.arrayFilter(self.magicItems(), function(item){
            return item.requiresAttunement() === true;
        });
        return numberAttuned.length === 0;
    });

    self.totalMagicItemWeight = ko.pureComputed(function() {
        var weightTotal = 0;
        var itemLength = self.magicItems().length;
        if (itemLength > 0) {
            for (var i = 0; i < itemLength; i++) {
                weightTotal += self.magicItems()[i].weight() ?
                    parseFloat(self.magicItems()[i].weight()) :
                    0;
            }
            return weightTotal + ' (lbs)';
        }
        else {
            return '0 (lbs)';
        }
    });

    self.determineMagicItemIcon = ko.computed(function() {
        if (self.currentEditItem() && self.currentEditItem().type()) {
            var type = self.currentEditItem().type();
            var cssClassName = type.split(' ')[0].toLowerCase() + '-magic-item-card';
            self.magicItemIconCSS(cssClassName);
        }
    });

    self.load = async() => {
        var key = CoreManager.activeCore().uuid();
        const response = await MagicItem.ps.list({coreUuid: key});
        self.magicItems(response.objects);

        self.magicItems().forEach(function(e, i, _) {
            e.attuned.subscribe(self.attunedHasChanged, e);
        });
    };

    self.attunedHasChanged = function() {
        this.ps.save();
        // self.magicItems().forEach(function(e, i, _) {
        //     e.save();
        // });
    };

    // Prepopulate methods

    self.populateMagicItems = function(label, value) {
        var magicItems = DataRepository.magicItems[label];

        self.blankMagicItem().importValues(magicItems);
        self.shouldShowDisclaimer(true);
    };

    self.setMagicItemType = function(label, value) {
        self.blankMagicItem().type(value);
    };

    self.setMagicItemRarity = function(label, value) {
        self.blankMagicItem().rarity(value);
    };

    // Modal methods
    self.modalFinishedOpening = function() {
        self.shouldShowDisclaimer(false);
        self.firstModalElementHasFocus(true);
    };

    self.modalFinishedClosing = async () => {
        self.previewTabStatus('active');
        self.editTabStatus('');
        self.previewTabStatus.valueHasMutated();
        self.editTabStatus.valueHasMutated();

        if (self.modalOpen()) {
            const response = await self.currentEditItem().ps.save();
            Utility.array.updateElement(self.magicItems(), response.object, self.editItemIndex);
            Notifications.magicItem.changed.dispatch();
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

    self.filteredAndSortedMagicItems = ko.computed(function() {
        return SortService.sortAndFilter(self.magicItems(), self.sort(), null);
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

    self.magicItemsPrePopFilter = function(request, response) {
        var term = request.term.toLowerCase();
        var keys = DataRepository.magicItems ? Object.keys(DataRepository.magicItems) : [];
        var results = keys.filter(function(name, idx, _) {
            return name.toLowerCase().indexOf(term) > -1;
        });
        response(results);
    };

    //Manipulating magic items
    self.addItem = async () => {
        var item = self.blankMagicItem();
        item.coreUuid(CoreManager.activeCore().uuid());
        const newMagicItem = await item.ps.create();
        self.magicItems.push(newMagicItem.object);
        self.blankMagicItem(new MagicItem());
        // Notifications.magicItem.changed.dispatch();
    };

    self.removeItem = async (item) => {
        await item.ps.delete();
        self.magicItems.remove(item);
        // Notifications.magicItem.changed.dispatch();
    };

    self.editItem = function(item) {
        self.editItemIndex = item.uuid;
        self.currentEditItem(new MagicItem());
        self.currentEditItem().importValues(item.exportValues());
        self.modalOpen(true);
    };

    self.clear = function() {
        self.magicItems([]);
    };
}

ko.components.register('magic-items', {
    viewModel: MagicItemsViewModel,
    template: template
});
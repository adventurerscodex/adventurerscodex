'use strict';

function MagicItemsViewModel() {
    var self = this;

    self.sorts = {
        'magicItemName asc': { field: 'magicItemName', direction: 'asc'},
        'magicItemName desc': { field: 'magicItemName', direction: 'desc'},
        'magicItemMaxCharges asc': { field: 'magicItemMaxCharges', direction: 'asc', numeric: true},
        'magicItemMaxCharges desc': { field: 'magicItemMaxCharges', direction: 'desc', numeric: true},
        'magicItemWeight asc': { field: 'magicItemWeight', direction: 'asc', numeric: true},
        'magicItemWeight desc': { field: 'magicItemWeight', direction: 'desc', numeric: true},
        'magicItemCharges asc': { field: 'magicItemCharges', direction: 'asc', numeric: true},
        'magicItemCharges desc': { field: 'magicItemCharges', direction: 'desc', numeric: true},
        'magicItemAttuned asc': { field: 'magicItemAttuned', direction: 'asc', booleanType: true},
        'magicItemAttuned desc': { field: 'magicItemAttuned', direction: 'desc', booleanType: true}
    };

    self.selecteditem = ko.observable();
    self.blankMagicItem = ko.observable(new MagicItem());
    self.magicItems = ko.observableArray([]);
    self.shouldShowDisclaimer = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');
    self.firstModalElementHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);
    self.magicItemIconCSS = ko.observable('');

    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['magicItemName asc']);

    self.numberOfAttuned = ko.computed(function(){
        var attuned = ko.utils.arrayFilter(self.magicItems(), function(item) {
            return item.magicItemAttuned() === true;
        });
        return attuned.length;
    });

    self.noneAttuned = ko.computed(function(){
        var numberAttuned = ko.utils.arrayFilter(self.magicItems(), function(item){
            return item.magicItemRequiresAttunement() === true;
        });
        return numberAttuned.length === 0;
    });

    self.totalMagicItemWeight = ko.pureComputed(function() {
        var weightTotal = 0;
        var itemLength = self.magicItems().length;
        if (itemLength > 0) {
            for (var i = 0; i < itemLength; i++) {
                weightTotal += self.magicItems()[i].magicItemWeight() ?
                    parseFloat(self.magicItems()[i].magicItemWeight()) :
                    0;
            }
            return weightTotal + ' (lbs)';
        }
        else {
            return '0 (lbs)';
        }
    });

    self.determineMagicItemIcon = ko.computed(function() {
        if (self.selecteditem() && self.selecteditem().magicItemType()) {
            var magicItemType = self.selecteditem().magicItemType();
            var cssClassName = magicItemType.split(' ')[0].toLowerCase() + '-magic-item-card';
            self.magicItemIconCSS(cssClassName);
        }
    });

    self.init = function() {
        Notifications.global.save.add(function() {
            self.magicItems().forEach(function(e, i, _) {
                e.save();
            });
        });
    };

    self.load = function() {
        var key = CharacterManager.activeCharacter().key();
        self.magicItems(MagicItem.findAllBy(key));
    };

    self.unload = function() {
        $.each(self.magicItems(), function(_, e) {
            e.save();
        });
    };

    self.populateMagicItems = function(label, value) {
        var magicItems = DataRepository.magicItems[label];

        self.blankMagicItem().importValues(magicItems);
        self.shouldShowDisclaimer(true);
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
        // Just in case data was changed.
        self.magicItems().forEach(function(e, i, _) {
            e.save();
        });
        Notifications.magicItem.changed.dispatch();
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
    self.addItem = function() {
        var item = self.blankMagicItem();
        item.characterId(CharacterManager.activeCharacter().key());
        item.save();
        self.magicItems.push(item);
        self.blankMagicItem(new MagicItem());
        Notifications.magicItem.changed.dispatch();
    };

    self.removeItem = function(item) {
        self.magicItems.remove(item);
        item.delete();
        Notifications.magicItem.changed.dispatch();
    };

    self.editItem = function(item) {
        self.selecteditem(item);
    };

    self.clear = function() {
        self.magicItems([]);
    };
}

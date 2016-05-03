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
                weightTotal += parseFloat(self.magicItems()[i].magicItemWeight());
            }
            return ('Weight: ' + weightTotal + ' (lbs)');
        }
        else {
            return 'Weight';
        }
    });

    self.init = function() {

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

    //Manipulating spells
    self.addItem = function() {
        var item = self.blankMagicItem();
        item.characterId(CharacterManager.activeCharacter().key());
        item.save();
        self.magicItems.push(item);
        self.blankMagicItem(new MagicItem());
    };

    self.removeItem = function(item) {
        self.magicItems.remove(item);
        item.delete();
    };

    self.editItem = function(item) {
        self.selecteditem(item);
    };

    self.clear = function() {
        self.magicItems([]);
    };
}

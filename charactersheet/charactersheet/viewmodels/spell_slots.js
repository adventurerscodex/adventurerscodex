'use strict';

function SpellSlotsViewModel() {
    var self = this;

    self.sorts = {
      'level asc': { field: 'level', direction: 'asc', numeric: true},
      'level desc': { field: 'level', direction: 'desc', numeric: true},
      'maxSpellSlots asc': { field: 'maxSpellSlots', direction: 'asc', numeric: true},
      'maxSpellSlots desc': { field: 'maxSpellSlots', direction: 'desc', numeric: true},
      'usedSpellSlots asc': { field: 'usedSpellSlots', direction: 'asc', numeric: true},
      'usedSpellSlots desc': { field: 'usedSpellSlots', direction: 'desc', numeric: true}
    };

    self.slots = ko.observableArray([]);
    self.blankSlot = ko.observable(new Slot());
    self.selecteditem = ko.observable(null);
    self.sort = ko.observable(self.sorts['level asc']);
    self.filter = ko.observable('');

    self.init = function() {};

    self.load = function() {
        var slots = Slot.findAllBy(CharacterManager.activeCharacter().key());
        self.slots(slots);

        self.blankSlot().level(self.slots().length + 1);
        self.blankSlot().maxSpellSlots(1);
    };

    self.unload = function() {
         self.slots().forEach(function(e, i, _) {
            e.save();
        });
    };

    /* UI Methods */

    /**
     * Filters and sorts the slots for presentation in a table.
     */
    self.filteredAndSortedSlots = ko.computed(function() {
        return SortService.sortAndFilter(self.slots(), self.sort(), null);
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

    //Manipulating spell slots
    self.maxSlotWidth = function() {
        return 100 / self.slots().length;
    };

    self.editSlot = function(slot) {
        self.selecteditem(slot);
    };

    self.addSlot = function() {
        var slot = self.blankSlot();
        slot.characterId(CharacterManager.activeCharacter().key());
        slot.save();
        self.slots.push(slot);

        self.blankSlot(new Slot());
        self.blankSlot().level(self.slots().length + 1);
        self.blankSlot().maxSpellSlots(1);
    };

    self.removeSlot = function(slot) {
        self.slots.remove(slot);
        slot.delete();
    };

    self.resetSlots = function() {
        self.slots().forEach(function(slot, i, _) {
            slot.usedSpellSlots(0);
        });
    };

    self.clear = function() {
        self.slots([]);
    };
};

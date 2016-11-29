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

    self.init = function() {
        Notifications.global.save.add(function() {
            self.slots().forEach(function(e, i, _) {
                e.save();
            });
        });
    };

    self.load = function() {
        var slots = Slot.findAllBy(CharacterManager.activeCharacter().key());
        self.slots(slots);

        self.blankSlot().level(self.slots().length + 1);
        self.blankSlot().maxSpellSlots(1);

        //Notifications
        Notifications.events.longRest.add(self.resetOnLongRest);
        Notifications.events.shortRest.add(self.resetShortRest);
    };

    self.unload = function() {
        self.slots().forEach(function(e, i, _) {
            e.save();
        });
        Notifications.events.longRest.remove(self.resetOnLongRest);
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

    //Manipulating slots

    /**
     * Resets all slots on a long-rest.
     */
    self.resetOnLongRest = function() {
        ko.utils.arrayForEach(self.slots(), function(slot) {
            slot.usedSpellSlots(0);
        });
    };

    /**
     * Resets all short-rest slot.
     */
    self.resetShortRest = function() {
        ko.utils.arrayForEach(self.slots(), function(slot) {
            if (slot.resetsOn() === Slot.REST_TYPE.SHORT_REST) {
                slot.usedSpellSlots(0);
            }
        });
    };

    // Modal Methods

    self.modifierHasFocus = ko.observable(false);
    self.editHasFocus = ko.observable(false);

    self.modalFinishedAnimating = function() {
        self.modifierHasFocus(true);
    };

    self.editModalOpen = function() {
        self.editHasFocus(true);
    };

    //Manipulating spell slots

    self.maxAvailableSlots = function() {
        var maxSlots = 0;
        self.slots().forEach(function(e, i, _) {
            maxSlots = maxSlots + parseInt(e.maxSpellSlots());
        });
        return maxSlots;
    };

    self.currentSlotWidth =  function(progressWidth, maxSlotsForLevel) {
        var maxSlots = self.maxAvailableSlots();
        maxSlotsForLevel = parseInt(maxSlotsForLevel);
        var maxSlotWidth = (100 * maxSlotsForLevel) / maxSlots;
        return (progressWidth * maxSlotWidth+ '%');
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

    self.increaseUsage = function(spellSlots) {
        var used = spellSlots.usedSpellSlots();
        if(used !== parseInt(spellSlots.maxSpellSlots())){
            spellSlots.usedSpellSlots(used + 1);
        }
    };

    self.decreaseUsage = function(spellSlots) {
        var used = spellSlots.usedSpellSlots();
        if(used !== 0){
            spellSlots.usedSpellSlots(used - 1);
        }
    };

    self.clear = function() {
        self.slots([]);
    };
}

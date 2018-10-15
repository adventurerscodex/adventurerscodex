import 'bin/knockout-bootstrap-modal';
import {
    CoreManager,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { Fixtures } from 'charactersheet/utilities';
import { SortService } from 'charactersheet/services/common';
import { SpellSlot } from 'charactersheet/models/character';
import campingTent from 'images/camping-tent-blue.svg';
import campingTentWhite from 'images/camping-tent.svg';
import ko from 'knockout';
import meditation from 'images/meditation-blue.svg';
import meditationWhite from 'images/meditation.svg';
import template from './index.html';

export function SpellSlotsViewModel() {
    var self = this;

    self.sorts = {
        'level asc': { field: 'level', direction: 'asc', numeric: true},
        'level desc': { field: 'level', direction: 'desc', numeric: true},
        'max asc': { field: 'max', direction: 'asc', numeric: true},
        'max desc': { field: 'max', direction: 'desc', numeric: true},
        'used asc': { field: 'used', direction: 'asc', numeric: true},
        'used desc': { field: 'used', direction: 'desc', numeric: true},
        'resetsOn asc': { field: 'resetsOn', direction: 'asc'},
        'resetsOn desc': { field: 'resetsOn', direction: 'desc'}
    };

    self.slots = ko.observableArray([]);
    self.blankSlot = ko.observable(new SpellSlot());
    self.openModal = ko.observable(false);
    self.editHasFocus = ko.observable(false);
    self.addFormIsValid = ko.observable(false);
    self.addModalOpen = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable();
    self.modifierHasFocus = ko.observable(false);
    self.sort = ko.observable(self.sorts['level asc']);
    self.filter = ko.observable('');
    self.slotColors = Fixtures.general.colorList;
    self.meditation = meditation;
    self.campingTent = campingTent;
    self.meditationWhite = meditationWhite;
    self.campingTentWhite = campingTentWhite;

    self.load = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await SpellSlot.ps.list({coreUuid: key});
        self.slots(response.objects);
        self.blankSlot().level(self.slots().length + 1);

        //Notifications
        Notifications.events.longRest.add(self.resetOnLongRest);
        Notifications.events.shortRest.add(self.resetShortRest);

        self.slots().forEach(function(slot, idx, _) {
            slot.max.subscribe(self.dataHasChanged, slot);
            slot.used.subscribe(self.dataHasChanged, slot);
        });
    };

    /* UI Methods */

    self.needsResetsOnImg = function(slot) {
        return slot.resetsOn() != '';
    };

    self.resetsOnImgSource = function(slot) {
        if (slot.resetsOn() === 'long') {
            return campingTent;
        } else if (slot.resetsOn() === 'short') {
            return meditation;
        } else {
            throw 'Unexpected slot resets on string.';
        }
    };

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
            slot.used(0);
        });
    };

    /**
     * Resets all short-rest slot.
     */
    self.resetShortRest = function() {
        ko.utils.arrayForEach(self.slots(), function(slot) {
            if (slot.resetsOn() === Fixtures.resting.shortRestEnum) {
                slot.used(0);
            }
        });
    };

    // Modal Methods

    self.validation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.addSlot();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...SpellSlot.validationConstraints
    };

    self.updateValidation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.modalFinishedClosing();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...SpellSlot.validationConstraints
    };

    self.toggleAddModal = () => {
        self.addModalOpen(!self.addModalOpen());
    };

    self.closeAddModal = () => {
        self.addModalOpen(false);
    };

    self.modalFinishedAnimating = function() {
        self.modifierHasFocus(true);
    };

    self.editModalOpen = function() {
        self.editHasFocus(true);
    };

    self.modalFinishedClosing = async () => {
        if (self.openModal() && self.addFormIsValid()) {
            const response = await self.currentEditItem().ps.save();
            Utility.array.updateElement(self.slots(), response.object, self.editItemIndex);
            Notifications.spellSlots.changed.dispatch();
        }

        self.openModal(false);
    };

    self.closeEditModal = () => {
        self.openModal(false);
    };

    //Manipulating spell slots

    self.maxAvailableSlots = function() {
        var maxSlots = 0;
        self.slots().forEach(function(e, i, _) {
            maxSlots = maxSlots + parseInt(e.max());
        });
        return maxSlots;
    };

    self.currentSlotWidth = (progressWidth, maxSlotsForLevel) => {
        var maxSlots = self.maxAvailableSlots();
        maxSlotsForLevel = parseInt(maxSlotsForLevel);
        var maxSlotWidth = (100 * maxSlotsForLevel) / maxSlots;
        return (progressWidth * maxSlotWidth+ '%');
    };

    self.getProgressWidth = (slot) => {
        return (slot.max()-slot.used()) / slot.max();
    };

    self.editSlot = async (slot) => {
        self.editItemIndex = slot.uuid;
        self.currentEditItem(new SpellSlot());
        self.currentEditItem().importValues(slot.exportValues());
        self.openModal(true);
    };

    self.addSlot = async () => {
        var slot = self.blankSlot();
        slot.color(self.slotColors[slot.level()-1]);
        slot.coreUuid(CoreManager.activeCore().uuid());
        const newSlotResponse = await slot.ps.create();
        var newSlot = newSlotResponse.object;
        newSlot.max.subscribe(self.dataHasChanged, newSlot);
        newSlot.used.subscribe(self.dataHasChanged, newSlot);
        self.slots.push(newSlot);

        self.blankSlot(new SpellSlot());
        self.blankSlot().level(self.slots().length + 1);
        self.toggleAddModal();
        Notifications.spellSlots.changed.dispatch();
    };

    self.removeSlot = async (slot) => {
        await slot.ps.delete();
        self.slots.remove(slot);
        self.blankSlot().level(self.slots().length + 1);
        Notifications.spellSlots.changed.dispatch();
    };

    self.resetSlot = function(slot) {
        slot.used(0);
    };

    self.resetSlots = function() {
        self.slots().forEach(function(slot, i, _) {
            slot.used(0);
        });
    };

    self.dataHasChanged = async function() {
        if (this.ps) {
            await this.ps.save();
            Notifications.spellSlots.changed.dispatch();
        }
    };
}

ko.components.register('spell-slots', {
    viewModel: SpellSlotsViewModel,
    template: template
});

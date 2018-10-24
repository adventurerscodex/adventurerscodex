import 'bin/knockout-bootstrap-modal';
import {
    CoreManager,
    Utility
} from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';
import { SavingThrow } from 'charactersheet/models/character';
import { SortService } from 'charactersheet/services/common';
import ko from 'knockout';
import template from './index.html';

export function SavingThrowsViewModel() {
    var self = this;

    self.blankSavingThrow = ko.observable(new SavingThrow());
    self.savingThrows = ko.observableArray([]);
    self.addFormIsValid = ko.observable(false);
    self.modalOpen = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable();

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc'},
        'name desc': { field: 'name', direction: 'desc'},
        'modifier asc': { field: 'modifier', direction: 'asc'},
        'modifier desc': { field: 'modifier', direction: 'desc'},
        'proficiency asc': { field: 'proficiency', direction: 'asc', booleanType: true},
        'proficiency desc': { field: 'proficiency', direction: 'desc', booleanType: true}
    };

    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['name asc']);

    self.load = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await SavingThrow.ps.list({coreUuid: key});
        self.savingThrows(response.objects);

        Notifications.abilityScores.changed.add(self.updateValues);
        Notifications.otherStats.proficiency.changed.add(self.updateValues);

        // Calculate Initial Values
        self.updateValues();
    };

    self.updateValues = async () => {
        // By telling each savingThrow to update their labels, we're implicitly
        // making a networking call. This should not be this way, but because
        // the fix is too time consuming, at time of writing, I'm just leaving
        // it and documenting the weirdness.
        for (const savingThrow of self.savingThrows()) {
            await savingThrow.updateModifierLabel();
        }
    };

    /* UI Methods */

    /**
     * Filters and sorts the savingThrows for presentation in a table.
     */
    self.filteredAndSortedSavingThrows = ko.computed(function() {
        return SortService.sortAndFilter(self.savingThrows(), self.sort(), null);
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

    // Modal Methods

    self.validation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.modalFinishedClosing();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...SavingThrow.validationConstraints
    };

    self.modifierHasFocus = ko.observable(false);

    self.modalFinishedAnimating = function() {
        self.modifierHasFocus(true);
    };

    self.modalFinishedClosing = async () => {
        if (self.modalOpen() && self.addFormIsValid()) {
            const response = await self.currentEditItem().ps.save();
            Utility.array.updateElement(self.savingThrows(), response.object, self.editItemIndex);
            self.updateValues();
        }

        self.modalOpen(false);
    };

    //Manipulating savingThrows
    self.addsavingThrow = function() {
        self.blankSavingThrow().save();
        self.savingThrows.push(self.blankSavingThrow());
        self.blankSavingThrow(new SavingThrow());
    };

    self.removeSavingThrow = function(savingThrow) {
        self.savingThrows.remove(savingThrow);
        savingThrow.delete();
    };

    self.editSavingThrow = function(savingThrow) {
        self.editItemIndex = savingThrow.uuid;
        self.currentEditItem(new SavingThrow());
        self.currentEditItem().importValues(savingThrow.exportValues());
        self.currentEditItem().modifierLabel(savingThrow.modifierLabel());
        self.currentEditItem().proficiency.subscribe(() => {
            self.currentEditItem().updateModifierLabel();
        });
        self.currentEditItem().modifier.subscribe(() => {
            self.currentEditItem().updateModifierLabel();
        });
        self.modalOpen(true);
    };

    self.closeEditModal = () => {
        self.modalOpen(false);
    };

    self.clear = function() {
        self.savingThrows([]);
    };
}

ko.components.register('savings-throws', {
    viewModel: SavingThrowsViewModel,
    template: template
});

import 'bin/knockout-bootstrap-modal';
import {
    CharacterManager,
    Utility
} from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { SavingThrows } from 'charactersheet/models/character';
import { SortService } from 'charactersheet/services/common';
import ko from 'knockout';
import template from './index.html';

export function SavingThrowsViewModel() {
    var self = this;

    self.blankSavingThrow = ko.observable(new SavingThrows());
    self.savingThrows = ko.observableArray([]);
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

    self._defaultSavingThrows = function() {
        var savingThrows = [
            { name: 'Strength', proficency: false, modifier: null },
            { name: 'Dexterity', proficency: false, modifier: null },
            { name: 'Constitution', proficency: false, modifier: null },
            { name: 'Intelligence', proficency: false, modifier: null },
            { name: 'Wisdom', proficency: false, modifier: null },
            { name: 'Charisma', proficency: false, modifier: null }
        ];
        return savingThrows.map(function(e,i, _) {
            var savingThrow = new SavingThrows();
            e.characterId = CharacterManager.activeCharacter().key();
            savingThrow.importValues(e);
            return savingThrow;
        });
    };

    self.load = function() {
        Notifications.abilityScores.changed.add(self.updateValues);
        Notifications.stats.changed.add(self.updateValues);
        Notifications.global.save.add(self.save);

        var savingThrows = PersistenceService.findBy(SavingThrows, 'characterId',
            CharacterManager.activeCharacter().key());
        if (savingThrows.length > 0) {
            self.savingThrows(savingThrows);
        } else {
            self.savingThrows(self._defaultSavingThrows());
            self.savingThrows().forEach(function(e, i, _) {
                e.characterId(CharacterManager.activeCharacter().key());
            });
            self.save();
        }
    };

    self.unload = function() {
        self.save();
        Notifications.abilityScores.changed.remove(self.updateValues);
        Notifications.stats.changed.remove(self.updateValues);
        Notifications.global.save.remove(self.save);
    };

    self.save = function() {
        self.savingThrows().forEach(function(e, i, _) {
            e.save();
        });
    };

    self.updateValues = function() {
        self.savingThrows().forEach(function(e, i, _) {
            e.updateValues();
        });
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

    self.modifierHasFocus = ko.observable(false);

    self.modalFinishedAnimating = function() {
        self.modifierHasFocus(true);
    };

    self.modalFinishedClosing = function() {
        if (self.modalOpen()) {
            Utility.array.updateElement(self.savingThrows(), self.currentEditItem(), self.editItemIndex);
        }

        self.save();
        self.modalOpen(false);
    };

    //Manipulating savingThrows
    self.addsavingThrow = function() {
        self.blankSavingThrow().save();
        self.savingThrows.push(self.blankSavingThrow());
        self.blankSavingThrow(new SavingThrows());
    };

    self.removeSavingThrow = function(savingThrow) {
        self.savingThrows.remove(savingThrow);
        savingThrow.delete();
    };

    self.editSavingThrow = function(savingThrow) {
        self.editItemIndex = savingThrow.__id;
        self.currentEditItem(new SavingThrows());
        self.currentEditItem().importValues(savingThrow.exportValues());
        self.modalOpen(true);
    };

    self.clear = function() {
        self.savingThrows([]);
    };
}

ko.components.register('savings-throws', {
    viewModel: SavingThrowsViewModel,
    template: template
});

import 'bin/knockout-bootstrap-modal';
import {
    CharacterManager,
    Utility
} from 'charactersheet/utilities';
import { DataRepository } from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { Proficiency } from 'charactersheet/models/character';
import { SortService } from 'charactersheet/services/common';
import ko from 'knockout';
import template from './index.html';

export function ProficienciesViewModel() {
    var self = this;

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc'},
        'name desc': { field: 'name', direction: 'desc'},
        'type asc': { field: 'type', direction: 'asc'},
        'type desc': { field: 'type', direction: 'desc'}
    };

    self.proficiencies = ko.observableArray([]);
    self.blankProficiency = ko.observable(new Proficiency());
    self.modalOpen = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable(new Proficiency());
    self.sort = ko.observable(self.sorts['name asc']);
    self.filter = ko.observable('');
    self.shouldShowDisclaimer = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');
    self.firstModalElementHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);

    self.load = function() {
        Notifications.global.save.add(self.save);

        var key = CharacterManager.activeCharacter().key();
        self.proficiencies(PersistenceService.findBy(Proficiency, 'characterId', key));
    };

    self.unload = function() {
        Notifications.global.save.remove(self.save);
    };

    self.save = function() {
        self.proficiencies().forEach(function(e, i, _) {
            e.save();
        });
    };

    // Pre-pop methods
    self.proficienciesPrePopFilter = function(request, response) {
        var term = request.term.toLowerCase();
        var keys = DataRepository.proficiencies ? Object.keys(DataRepository.proficiencies) : [];
        var results = keys.filter(function(name, idx, _) {
            return name.toLowerCase().indexOf(term) > -1;
        });
        response(results);
    };

    self.populateProficiency = function(label, value) {
        var proficiency = DataRepository.proficiencies[label];

        self.blankProficiency().importValues(proficiency);
        self.shouldShowDisclaimer(true);
    };

    self.setType = function(label, value) {
        self.blankProficiency().type(value);
    };

    // Modal methods
    self.modalFinishedOpening = function() {
        self.shouldShowDisclaimer(false);
        self.firstModalElementHasFocus(true);
    };

    self.modalFinishedClosing = function() {
        self.previewTabStatus('active');
        self.editTabStatus('');

        if (self.modalOpen()) {
            Utility.array.updateElement(self.proficiencies(), self.currentEditItem(), self.editItemIndex);
        }

        // Just in case data was changed.
        self.save();

        self.modalOpen(false);
        Notifications.proficiency.changed.dispatch();
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

    self.filteredAndSortedProficiencies = ko.computed(function() {
        return SortService.sortAndFilter(self.proficiencies(), self.sort(), null);
    });

    self.sortArrow = function(columnName) {
        return SortService.sortArrow(columnName, self.sort());
    };

    self.sortBy = function(columnName) {
        self.sort(SortService.sortForName(self.sort(),
            columnName, self.sorts));
    };

    self.addProficiency = function() {
        var proficiency = self.blankProficiency();
        proficiency.characterId(CharacterManager.activeCharacter().key());
        proficiency.save();
        self.proficiencies.push(proficiency);
        self.blankProficiency(new Proficiency());
    };

    self.clear = function() {
        self.proficiencies([]);
    };

    self.removeProficiency = function(proficiency) {
        self.proficiencies.remove(proficiency);
        proficiency.delete();
        Notifications.proficiency.changed.dispatch();
    };

    self.editProficiency = function(proficiency) {
        self.editItemIndex = proficiency.__id;
        self.currentEditItem(new Proficiency());
        self.currentEditItem().importValues(proficiency.exportValues());
        self.modalOpen(true);
    };
}

ko.components.register('proficiencies', {
    viewModel: ProficienciesViewModel,
    template: template
});
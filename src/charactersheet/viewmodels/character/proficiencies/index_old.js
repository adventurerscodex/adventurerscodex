import 'bin/knockout-bootstrap-modal';
import {
    CoreManager,
    Utility
} from 'charactersheet/utilities';
import { DataRepository } from 'charactersheet/utilities';
import { Fixtures } from 'charactersheet/utilities/fixtures';
import { Notifications } from 'charactersheet/utilities';
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
    self.addModalOpen = ko.observable(false);
    self.modalOpen = ko.observable(false);
    self.addFormIsValid = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable(new Proficiency());
    self.sort = ko.observable(self.sorts['name asc']);
    self.filter = ko.observable('');
    self.shouldShowDisclaimer = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');
    self.firstModalElementHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);
    self.proficiencyType = Fixtures.proficiency.proficiencyTypes;

    self._addForm = ko.observable();
    self._editForm = ko.observable();

    self.load = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await Proficiency.ps.list({coreUuid: key});
        self.proficiencies(response.objects);
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

    self.validation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.addProficiency();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...Proficiency.validationConstraints
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
        ...Proficiency.validationConstraints
    };

    self.toggleAddModal = () => {
        self.addModalOpen(!self.addModalOpen());
    };

    self.closeAddModal = () => {
        self.addModalOpen(false);

        // Let the validator reset the validation in the form.
        $(self._addForm()).validate().resetForm();
    };

    self.closeEditModal = () => {
        self.modalOpen(false);
        self.selectPreviewTab();

        // Let the validator reset the validation in the form.
        $(self._editForm()).validate().resetForm();
    };

    self.modalFinishedOpening = function() {
        self.shouldShowDisclaimer(false);
        self.firstModalElementHasFocus(true);
    };

    self.modalFinishedClosing = async () => {
        self.previewTabStatus('active');
        self.editTabStatus('');

        if (self.modalOpen() && self.addFormIsValid()) {
            const response = await self.currentEditItem().ps.save();
            Utility.array.updateElement(self.proficiencies(), response.object, self.editItemIndex);
        }

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

    self.addProficiency = async () => {
        var proficiency = self.blankProficiency();
        proficiency.coreUuid(CoreManager.activeCore().uuid());
        const newProficiency = await proficiency.ps.create();
        self.proficiencies.push(newProficiency.object);
        self.blankProficiency(new Proficiency());
        self.toggleAddModal();
    };

    self.clear = function() {
        self.proficiencies([]);
    };

    self.removeProficiency = async (proficiency) => {
        await proficiency.ps.delete();
        self.proficiencies.remove(proficiency);
        Notifications.proficiency.changed.dispatch();
    };

    self.editProficiency = function(proficiency) {
        self.editItemIndex = proficiency.uuid;
        self.currentEditItem(new Proficiency());
        self.currentEditItem().importValues(proficiency.exportValues());
        self.modalOpen(true);
    };
}

ko.components.register('proficiencies', {
    viewModel: ProficienciesViewModel,
    template: template
});

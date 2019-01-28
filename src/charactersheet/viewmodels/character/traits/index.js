import 'bin/knockout-bootstrap-modal';
import {
    CoreManager,
    DataRepository,
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import {
    Tracked,
    Trait
} from 'charactersheet/models';
import { SortService } from 'charactersheet/services/common';
import campingTent from 'images/camping-tent.svg';
import ko from 'knockout';
import meditation from 'images/meditation.svg';
import template from './index.html';
import uuid from 'node-uuid';

export function TraitsViewModel() {
    var self = this;

    self.DESCRIPTION_MAX_LENGTH = 45;

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc'},
        'name desc': { field: 'name', direction: 'desc'},
        'race asc': { field: 'race', direction: 'asc'},
        'race desc': { field: 'race', direction: 'desc'}
    };

    self.traits = ko.observableArray([]);
    self.blankTrait = ko.observable(new Trait());
    self.blankTracked = ko.observable(new Tracked());
    self.addModalOpen = ko.observable(false);
    self.modalOpen = ko.observable(false);
    self.addFormIsValid = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable(new Trait());
    self.currentEditTracked = ko.observable(new Tracked());
    self.sort = ko.observable(self.sorts['name asc']);
    self.filter = ko.observable('');
    self.shouldShowDisclaimer = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');
    self.firstModalElementHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);
    self.meditation = meditation;
    self.campingTent = campingTent;

    // Static Data
    self.raceOptions = Fixtures.profile.raceOptions;

    self.load = async () => {
        await self.loadTraits();

        Notifications.tracked.trait.changed.add(self.loadTraits);
    };

    self.loadTraits = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await Trait.ps.list({coreUuid: key});
        self.traits(response.objects);
    };

    // Pre-pop methods
    self.traitsPrePopFilter = function(request, response) {
        var term = request.term.toLowerCase();
        var keys = DataRepository.traits ? Object.keys(DataRepository.traits) : [];
        var results = keys.filter(function(name, idx, _) {
            return name.toLowerCase().indexOf(term) > -1;
        });
        response(results);
    };

    self.populateRace = function(label, value) {
        self.blankTrait().race(value);
    };

    self.populateRaceEdit = function(label, value) {
        self.currentEditItem().race(value);
    };

    self.populateTrait = function(label, value) {
        var trait = DataRepository.traits[label];

        self.blankTrait().importValues(trait);
        self.shouldShowDisclaimer(true);
    };

    // Modal methods

    self.validation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.addTrait();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...Trait.validationConstraints
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
        ...Trait.validationConstraints
    };

    self.modalFinishedOpening = function() {
        self.shouldShowDisclaimer(false);
        self.firstModalElementHasFocus(true);
    };

    self.modalFinishedClosing = async () => {
        self.previewTabStatus('active');
        self.editTabStatus('');

        if (self.modalOpen() && self.addFormIsValid()) {
            if (!self.currentEditItem().isTracked()) {
                self.currentEditTracked(null);
            }
            self.currentEditItem().tracked(self.currentEditTracked());
            const response = await self.currentEditItem().ps.save();
            Utility.array.updateElement(self.traits(), response.object, self.editItemIndex);
        }

        self.currentEditItem(new Trait());
        self.currentEditTracked(new Tracked());
        self.modalOpen(false);
        Notifications.trait.changed.dispatch();
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

    self.filteredAndSortedTraits = ko.computed(function() {
        return SortService.sortAndFilter(self.traits(), self.sort(), null);
    });

    self.sortArrow = function(columnName) {
        return SortService.sortArrow(columnName, self.sort());
    };

    self.sortBy = function(columnName) {
        self.sort(SortService.sortForName(self.sort(), columnName, self.sorts));
    };

    self.addTrait = async () => {
        var trait = self.blankTrait();
        trait.coreUuid(CoreManager.activeCore().uuid());
        if (trait.isTracked()) {
            trait.tracked(self.blankTracked());
        }
        const newTrait = await trait.ps.create();
        self.traits.push(newTrait.object);
        self.blankTrait(new Trait());
        self.blankTracked(new Tracked());
        self.toggleAddModal();
    };

    self.toggleAddModal = () => {
        self.addModalOpen(!self.addModalOpen());
    };

    self.closeAddModal = () => {
        self.addModalOpen(false);
        Notifications.trait.changed.dispatch();
    };

    self.closeEditModal = () => {
        self.modalOpen(false);
        self.selectPreviewTab();
    };

    self.clear = function() {
        self.traits([]);
    };

    self.removeTrait = async (trait) => {
        await trait.ps.delete();
        self.traits.remove(trait);
        Notifications.trait.changed.dispatch();
    };

    self.editTrait = function(trait) {
        self.editItemIndex = trait.uuid;
        self.currentEditItem(new Trait());
        self.currentEditItem().importValues(trait.exportValues());
        if (trait.tracked()) {
            self.currentEditItem().isTracked(true);
            self.currentEditTracked(trait.tracked());
        }
        self.modalOpen(true);
    };

    self.trackedPopoverText = function() {
        return 'Tracked Traits are listed in the Tracker.';
    };
}

ko.components.register('traits', {
    viewModel: TraitsViewModel,
    template: template
});

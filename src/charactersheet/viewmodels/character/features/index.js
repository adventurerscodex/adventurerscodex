import 'bin/knockout-bootstrap-modal';
import {
    CoreManager,
    DataRepository,
    Fixtures,
    Notifications
} from 'charactersheet/utilities';
import {
    Feature,
    Tracked
} from 'charactersheet/models';
import { CharacterClass } from 'charactersheet/models/common';
import { SortService } from 'charactersheet/services/common';
import { Utility } from 'charactersheet/utilities';
import campingTent from 'images/camping-tent.svg';
import ko from 'knockout';
import meditation from 'images/meditation.svg';
import template from './index.html';
import uuid from 'node-uuid';
import validation from './validation';

export function FeaturesViewModel() {
    var self = this;

    self.DESCRIPTION_MAX_LENGTH = 45;

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc'},
        'name desc': { field: 'name', direction: 'desc'},
        'characterClass asc': { field: 'characterClass', direction: 'asc'},
        'characterClass desc': { field: 'characterClass', direction: 'desc'}
    };

    self.features = ko.observableArray([]);
    self.blankFeature = ko.observable(new Feature());
    self.blankTracked = ko.observable(new Tracked());
    self.addModalOpen = ko.observable(false);
    self.modalOpen = ko.observable(false);
    self.addFormIsValid = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable(new Feature());
    self.currentEditTracked = ko.observable(new Tracked());
    self.sort = ko.observable(self.sorts['name asc']);
    self.filter = ko.observable('');
    self.shouldShowDisclaimer = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');
    self.firstModalElementHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);
    self.addFormIsValid = ko.observable(false);
    self.meditation = meditation;
    self.campingTent = campingTent;

    self.load = async () => {
        await self.loadFeatures();

        Notifications.tracked.feature.changed.add(self.loadFeatures);
    };

    self.loadFeatures = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await Feature.ps.list({coreUuid: key});
        self.features(response.objects);
    };

    // Pre-pop methods
    self.featuresPrePopFilter = function(request, response) {
        var term = request.term.toLowerCase();
        var keys = DataRepository.features ? DataRepository.featuresDisplayNames : [];
        var results = keys.filter(function(name, idx, _) {
            return name.toLowerCase().indexOf(term) > -1;
        });
        response(results);
    };

    self.populateFeature = function(label, value) {
        var feature = DataRepository.filterBy('features', 'displayName', label)[0];
        if (feature) {
            self.blankFeature().importValues(feature);
            self.shouldShowDisclaimer(true);
        }
    };

    self.populateClass = function(label, value) {
        self.blankFeature().characterClass(value);
    };

    self.populateClassEdit = function(label, value) {
        self.currentEditItem().characterClass(value);
    };

    // Modal methods

    self.validation = {
        submitHandler: (form) => {
            self.addFeature();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        rules: validation.rules,
        messages: validation.messages
    };

    self.toggleAddModal = () => {
        self.addModalOpen(!self.addModalOpen());
    };

    self.modalFinishedOpening = function() {
        self.shouldShowDisclaimer(false);
        self.firstModalElementHasFocus(true);
    };

    self.modalFinishedClosing = async () => {
        self.previewTabStatus('active');
        self.editTabStatus('');

        if (self.modalOpen()) {
            if (!self.currentEditItem().isTracked()) {
                self.currentEditTracked(null);
            }
            self.currentEditItem().tracked(self.currentEditTracked());
            const response = await self.currentEditItem().ps.save();
            Utility.array.updateElement(self.features(), response.object, self.editItemIndex);
        }

        self.currentEditItem(new Feature());
        self.currentEditTracked(new Tracked());
        self.modalOpen(false);
        Notifications.feature.changed.dispatch();
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

    self.filteredAndSortedFeatures = ko.computed(function() {
        return SortService.sortAndFilter(self.features(), self.sort(), null);
    });

    self.sortArrow = function(columnName) {
        return SortService.sortArrow(columnName, self.sort());
    };

    self.sortBy = function(columnName) {
        self.sort(SortService.sortForName(self.sort(),
            columnName, self.sorts));
    };

    self.addFeature = async () => {
        var feature = self.blankFeature();
        feature.coreUuid(CoreManager.activeCore().uuid());
        if (feature.isTracked()) {
            // todo: need logic to actually set the color
            self.blankTracked().color('progress-bar-sky');
            feature.tracked(self.blankTracked());
        }
        const newFeature = await feature.ps.create();
        self.features.push(newFeature.object);
        self.blankFeature(new Feature());
        self.blankTracked(new Tracked());

        self.toggleAddModal();
    };

    self.clear = function() {
        self.features([]);
    };

    self.removeFeature = async (feature) => {
        await feature.ps.delete();
        self.features.remove(feature);
        Notifications.feature.changed.dispatch();
    };

    self.editFeature = function(feature) {
        self.editItemIndex = feature.uuid;
        self.currentEditItem(new Feature());
        self.currentEditItem().importValues(feature.exportValues());
        if (feature.tracked()) {
            self.currentEditItem().isTracked(true);
            self.currentEditTracked(feature.tracked());
        }
        self.modalOpen(true);
    };

    self.trackedPopoverText = function() {
        return 'Tracked Features are listed in the Tracker.';
    };

    // Validation

    self.validation = {
        submitHandler: (form) => {
            self.addFeature();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        rules: validation.rules,
        messages: validation.messages
    };
}

ko.components.register('features', {
    viewModel: FeaturesViewModel,
    template: template
});



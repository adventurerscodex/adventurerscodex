import ko from 'knockout'
import uuid from 'node-uuid'

import { Notifications,
    DataRepository,
    CharacterManager,
    Fixtures } from 'charactersheet/utilities'
import { PersistenceService,
    SortService } from 'charactersheet/services/common'
import { Tracked,
    Feature } from 'charactersheet/models'
import { Utility } from 'charactersheet/utilities'

import template from './index.html'

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
    self.modalOpen = ko.observable(false);
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

    //Static Data
    self.classOptions = Fixtures.profile.classOptions;

    self.load = function() {
        Notifications.global.save.add(self.save);

        var key = CharacterManager.activeCharacter().key();
        self.features(PersistenceService.findBy(Feature, 'characterId', key));
    };

    self.unload = function() {
        Notifications.global.save.remove(self.save);
    };

    self.save = function() {
        self.features().forEach(function(e, i, _) {
            e.save();
        });
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
    self.modalFinishedOpening = function() {
        self.shouldShowDisclaimer(false);
        self.firstModalElementHasFocus(true);
    };

    self.modalFinishedClosing = function() {
        self.previewTabStatus('active');
        self.editTabStatus('');

        if (self.modalOpen()) {
            if (self.currentEditItem().isTracked()) {
                if (self.currentEditItem().trackedId()) {
                    var tracked = PersistenceService.findFirstBy(Tracked, 'trackedId', self.currentEditItem().trackedId());
                    tracked.importValues(self.currentEditTracked().exportValues());
                    tracked.save();
                } else {
                    self.currentEditItem().trackedId(uuid.v4());
                    self.addTracked(self.currentEditItem().trackedId(),
                        self.currentEditItem().characterId(), self.currentEditTracked());
                }
            } else if (self.currentEditItem().trackedId()) {
                var trackedToDelete = PersistenceService.findFirstBy(Tracked, 'trackedId', self.currentEditItem().trackedId());
                trackedToDelete.delete();
                self.currentEditItem().trackedId(null);
            }
            Utility.array.updateElement(self.features(), self.currentEditItem(), self.editItemIndex);
        }

        self.save();
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

    self.addFeature = function() {
        var feature = self.blankFeature();
        feature.characterId(CharacterManager.activeCharacter().key());
        if (feature.isTracked()) {
            feature.trackedId(uuid.v4());
            self.addTracked(feature.trackedId(), feature.characterId(), self.blankTracked());
        }
        feature.save();
        self.features.push(feature);
        self.blankFeature(new Feature());
        self.blankTracked(new Tracked());
    };

    self.addTracked = function(uuid, characterId, tracked) {
        var newTracked = new Tracked();
        newTracked.characterId(characterId);
        newTracked.trackedId(uuid);
        newTracked.maxUses(tracked.maxUses());
        newTracked.resetsOn(tracked.resetsOn());
        newTracked.type(Feature);
        var trackedList = PersistenceService.findBy(Tracked, 'characterId', characterId);
        newTracked.color(Fixtures.general.colorList[trackedList.length
          % Fixtures.general.colorList.length]);
        newTracked.save();
    };

    self.clear = function() {
        self.features([]);
    };

    self.removeFeature = function(feature) {
        if (feature.isTracked()) {
            var tracked = PersistenceService.findFirstBy(
                Tracked, 'trackedId', feature.trackedId());
            tracked.delete();
        }
        self.features.remove(feature);
        feature.delete();
        Notifications.feature.changed.dispatch();
    };

    self.editFeature = function(feature) {
        self.editItemIndex = feature.__id;
        self.currentEditItem(new Feature());
        self.currentEditItem().importValues(feature.exportValues());
        if (feature.isTracked()) {
            self.currentEditTracked(PersistenceService.findFirstBy(Tracked, 'trackedId', feature.trackedId()));
        }
        self.modalOpen(true);
    };

    self.trackedPopoverText = function() {
        return 'Tracked Features are listed in the Tracker.';
    };
}

ko.components.register('features', {
  viewModel: FeaturesViewModel,
  template: template
})

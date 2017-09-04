'use strict';

import ko from 'knockout'

import { CharacterManager,
    DataRepository,
    Notifications } from 'charactersheet/utilities'
import { PersistenceService,
    SortService } from 'charactersheet/services/common'
import { Tracked,
    Trait } from 'charactersheet/models/common'

import template from './index.html'

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
    self.modalOpen = ko.observable(false);
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

    //Static Data
    self.raceOptions = Fixtures.profile.raceOptions;

    self.load = function() {
        Notifications.global.save.add(self.save);

        var key = CharacterManager.activeCharacter().key();
        self.traits(PersistenceService.findBy(Trait, 'characterId', key));
    };

    self.unload = function() {
        Notifications.global.save.remove(self.save);
    };

    self.save = function() {
        self.traits().forEach(function(e, i, _) {
            e.save();
        });
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
            Utility.array.updateElement(self.traits(), self.currentEditItem(), self.editItemIndex);
        }

        self.save();
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
        self.sort(SortService.sortForName(self.sort(),
            columnName, self.sorts));
    };

    self.addTrait = function() {
        var trait = self.blankTrait();
        trait.characterId(CharacterManager.activeCharacter().key());
        if (trait.isTracked()) {
            trait.trackedId(uuid.v4());
            self.addTracked(trait.trackedId(), trait.characterId(), self.blankTracked());
        }
        trait.save();
        self.traits.push(trait);
        self.blankTrait(new Trait());
        self.blankTracked(new Tracked());
    };

    self.addTracked = function(uuid, characterId, tracked) {
        var newTracked = new Tracked();
        newTracked.characterId(characterId);
        newTracked.trackedId(uuid);
        newTracked.maxUses(tracked.maxUses());
        newTracked.resetsOn(tracked.resetsOn());
        newTracked.type(Trait);
        var trackedList = PersistenceService.findBy(Tracked, 'characterId', characterId);
        newTracked.color(Fixtures.general.colorList[trackedList.length
          % Fixtures.general.colorList.length]);
        newTracked.save();
    };

    self.clear = function() {
        self.traits([]);
    };

    self.removeTrait = function(trait) {
        if (trait.isTracked()) {
            var tracked = PersistenceService.findFirstBy(
                Tracked, 'trackedId', trait.trackedId());
            tracked.delete();
        }
        self.traits.remove(trait);
        trait.delete();
        Notifications.trait.changed.dispatch();
    };

    self.editTrait = function(trait) {
        self.editItemIndex = trait.__id;
        self.currentEditItem(new Trait());
        self.currentEditItem().importValues(trait.exportValues());
        if (trait.isTracked()) {
            self.currentEditTracked(PersistenceService.findFirstBy(Tracked, 'trackedId', trait.trackedId()));
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
})
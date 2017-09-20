import ko from 'knockout'

import { CharacterManager } from 'charactersheet/utilities'
import { Notifications } from 'charactersheet/utilities'
import { PersistenceService } from 'charactersheet/services/common'
import { SortService } from 'charactersheet/services/common'
import { Utility } from 'charactersheet/utilities'
import { Feat, Trait, Feature } from 'charactersheet/models'

import template from './index.html'

export function TrackerViewModel() {
    var self = this;

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc'},
        'name desc': { field: 'name', direction: 'desc'}
    };

    self.trackables = ko.observableArray([]);
    self.editItem = ko.observable();
    self.modalOpen = ko.observable(false);
    self.editModalTitle = ko.observable('');
    self.sort = ko.observable(self.sorts['name asc']);
    self.filter = ko.observable('');
    // List of all models that can be tracked
    self.trackedTypes = [ Feat, Trait, Feature ];

    self.load = function() {
        Notifications.global.save.add(self.save);
        self.loadTrackedItems();

        self.trackables().forEach(function(tracked, idx, _) {
            tracked.tracked().maxUses.subscribe(self.dataHasChanged);
            tracked.tracked().used.subscribe(self.dataHasChanged);
        });

        //Notifications
        Notifications.events.shortRest.add(self.resetShortRestFeatures);
        Notifications.events.longRest.add(self.resetLongRestFeatures);
        Notifications.feat.changed.add(self.loadTrackedItems);
        Notifications.trait.changed.add(self.loadTrackedItems);
        Notifications.feature.changed.add(self.loadTrackedItems);
    };

    self.loadTrackedItems = function() {
        var key = CharacterManager.activeCharacter().key();
        var trackables = [];
        // Fetch all items that can be tracked
        self.trackedTypes.forEach(function(type, idx, _){
            var result = PersistenceService.findBy(type, 'characterId', key);
            trackables = trackables.concat(result);
        });
        var tracked = trackables.filter(function(e, i, _) {
            if (e.isTracked()) {
                e.tracked(PersistenceService.findFirstBy(Tracked, 'trackedId', e.trackedId()));
            }
            return e.isTracked();
        });
        self.trackables(tracked);
        self.trackables().forEach(function(tracked, idx, _) {
            tracked.tracked().maxUses.subscribe(self.dataHasChanged);
            tracked.tracked().used.subscribe(self.dataHasChanged);
        });
    };

    self.unload = function() {
        self.save();
        Notifications.global.save.remove(self.save);
        Notifications.events.longRest.remove(self.resetShortRestFeatures);
        Notifications.events.shortRest.remove(self.resetShortRestFeatures);
        Notifications.feat.changed.remove(self.loadTrackedItems);
        Notifications.trait.changed.remove(self.loadTrackedItems);
        Notifications.feature.changed.remove(self.loadTrackedItems);
    };

    self.save = function() {
        self.trackables().forEach(function(item, idx, _){
            item.tracked().save();
        });
    };

    /* UI Methods */

    self.trackedElementProgressWidth = function(max, used) {
        return (parseInt(max) - parseInt(used)) / parseInt(max);
    };

    self.shortName = function(string) {
        return Utility.string.truncateStringAtLength(string(), 15);
    };

    /**
     * Filters and sorts the trackables for presentation in a table.
     */
    self.filteredAndSortedTrackables = ko.computed(function() {
        return SortService.sortAndFilter(self.trackables(), self.sort(), null);
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
        self.sort(SortService.sortForName(self.sort(), columnName, self.sorts));
    };

    //Manipulating tracked elements

    self.resetShortRestFeatures = function() {
        ko.utils.arrayForEach(self.trackables(), function(item) {
            if (item.tracked().resetsOn() === Fixtures.resting.shortRestEnum) {
                item.tracked().used(0);
            }
        });
    };

    self.resetLongRestFeatures = function() {
        ko.utils.arrayForEach(self.trackables(), function(item) {
            item.tracked().used(0);
        });
    };

    self.maxTrackerWidth = function() {
        return 100 / self.trackables().length;
    };

    // Modal Methods

    self.modifierHasFocus = ko.observable(false);
    self.editHasFocus = ko.observable(false);

    self.modalFinishedAnimating = function() {
        self.modifierHasFocus(true);
    };

    self.modalFinishedClosing = function() {
        if (self.modalOpen()) {
            var tracked = PersistenceService.findFirstBy(Tracked, 'trackedId',
                self.editItem().trackedId());
            tracked.importValues(self.editItem().exportValues());
            tracked.save();
            self.trackables().forEach(function(item, idx, _) {
                if (item.trackedId() === tracked.trackedId()) {
                    item.tracked().importValues(tracked.exportValues());
                }
            });
        }
        self.dataHasChanged();
        self.modalOpen(false);
    };

    self.dataHasChanged = function() {
        self.save();
        Notifications.tracked.changed.dispatch();
    };

    self.editModalOpen = function() {
        self.editHasFocus(true);
    };

    self.editTracked = function(item) {
        self.editModalTitle(item.name());
        self.editItem(new Tracked());
        self.editItem().importValues(item.tracked().exportValues());
        self.modalOpen(true);
    };

    self.refreshTracked = function(item) {
        item.tracked().used(0);
    };

    self.clear = function() {
        self.trackables([]);
    };
}

ko.components.register('tracker', {
  viewModel: TrackerViewModel,
  template: template
})
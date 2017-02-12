'use strict';

function DailyFeatureViewModel() {
    var self = this;

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc'},
        'name desc': { field: 'name', direction: 'desc'}
    };

    self.dailyFeatures = ko.observableArray([]);
    self.editItem = ko.observable();
    self.modalOpen = ko.observable(false);
    self.editItemIndex = null;
    self.sort = ko.observable(self.sorts['name asc']);
    self.filter = ko.observable('');
    // List of all models that can be tracked
    self.trackedTypes = [ Feat, Trait ];

    self.load = function() {
        Notifications.global.save.add(self.save);
        self.loadTrackedItems();

        //Notifications
        Notifications.events.shortRest.add(self.resetShortRestFeatures);
        Notifications.events.longRest.add(self.resetLongRestFeatures);
        Notifications.feat.changed.add(self.loadTrackedItems);
        Notifications.trait.changed.add(self.loadTrackedItems);
    };

    self.loadTrackedItems = function() {
        var key = CharacterManager.activeCharacter().key();
        var dailyFeatures = [];
        // Fetch all items that can be tracked
        self.trackedTypes.forEach(function(type, idx, _){
            var result = PersistenceService.findBy(type, 'characterId', key);
            dailyFeatures = dailyFeatures.concat(result);
        });
        var tracked = dailyFeatures.filter(function(e, i, _) {
            if (e.isTracked()) {
                e.tracked(PersistenceService.findFirstBy(Tracked, 'trackedId', e.trackedId()));
            }
            return e.isTracked();
        });
        self.dailyFeatures(tracked);
    };

    self.unload = function() {
        self.save();
        Notifications.global.save.remove(self.save);
        Notifications.events.longRest.remove(self.resetShortRestFeatures);
        Notifications.events.shortRest.remove(self.resetShortRestFeatures);
        Notifications.feat.changed.remove(self.loadTrackedItems);
        Notifications.trait.changed.remove(self.loadTrackedItems);
    };

    self.save = function() {
        self.dailyFeatures().forEach(function(item, idx, _){
            item.tracked().save();
        });
    };

    /* UI Methods */

    self.dailyFeaturesProgressWidth = function(max, used) {
        return (parseInt(max) - parseInt(used)) / parseInt(max);
    };

    /**
     * Filters and sorts the daily features for presentation in a table.
     */
    self.filteredAndSortedDailyFeatures = ko.computed(function() {
        return SortService.sortAndFilter(self.dailyFeatures(), self.sort(), null);
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

    //Manipulating daily features

    /**
     * Resets all short-rest features.
     */
    self.resetShortRestFeatures = function() {
        ko.utils.arrayForEach(self.dailyFeatures(), function(item) {
            if (item.tracked().resetsOn() === Fixtures.resting.shortRestEnum) {
                item.tracked().used(0);
            }
        });
    };

    /**
     * Resets all long-rest features.
     */
    self.resetLongRestFeatures = function() {
        ko.utils.arrayForEach(self.dailyFeatures(), function(item) {
            if (item.tracked().resetsOn() === Fixtures.resting.shortRestEnum ||
                item.tracked().resetsOn() === Fixtures.resting.longRestEnum) {
                item.tracked().used(0);
            }
        });
    };

    self.maxFeatureWidth = function() {
        return 100 / self.dailyFeatures().length;
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
            self.dailyFeatures().forEach(function(item, idx, _) {
                if (item.trackedId() === tracked.trackedId()) {
                    item.tracked().importValues(tracked.exportValues());
                }
            });
        }
        self.modalOpen(false);
    };

    self.editModalOpen = function() {
        self.editHasFocus(true);
    };

    self.editDailyFeature = function(item) {
        self.editItem(new Tracked());
        self.editItem().importValues(item.tracked().exportValues());
        self.modalOpen(true);
    };

    self.refreshDailyFeature = function(item) {
        item.tracked().used(0);
    };

    self.clear = function() {
        self.dailyFeatures([]);
    };
}

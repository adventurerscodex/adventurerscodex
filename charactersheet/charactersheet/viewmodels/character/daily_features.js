'use strict';

function DailyFeatureViewModel() {
    var self = this;

    self.sorts = {
        'featureName asc': { field: 'featureName', direction: 'asc'},
        'featureName desc': { field: 'featureName', direction: 'desc'},
        'featureMaxUses asc': { field: 'featureMaxUses', direction: 'asc', numeric: true},
        'featureMaxUses desc': { field: 'featureMaxUses', direction: 'desc', numeric: true},
        'featureResetsOn asc': { field: 'featureResetsOn', direction: 'asc'},
        'featureResetsOn desc': { field: 'featureResetsOn', direction: 'desc'}
    };

    self.dailyFeatures = ko.observableArray([]);
    self.blankDailyFeature = ko.observable(new DailyFeature());
    self.selecteditem = ko.observable(null);
    self.sort = ko.observable(self.sorts['featureName asc']);
    self.filter = ko.observable('');

    self.init = function() {
        Notifications.global.save.add(function() {
            self.dailyFeatures().forEach(function(e, i, _) {
                e.save();
            });
        });
    };

    self.load = function() {
        var dailyFeatures = DailyFeature.findAllBy(CharacterManager.activeCharacter().key());
        if (dailyFeatures.length > 0) {
            self.dailyFeatures(dailyFeatures);
        } else {
            self.dailyFeatures([]);
        }

        //Notifications
        Notifications.events.shortRest.add(self.resetShortRestFeatures);
        Notifications.events.longRest.add(self.resetLongRestFeatures);
    };

    self.unload = function() {
        self.dailyFeatures().forEach(function(e, i, _) {
            e.save();
        });
        Notifications.events.longRest.remove(self.resetShortRestFeatures);
        Notifications.events.shortRest.remove(self.resetShortRestFeatures);
    };

    /* UI Methods */

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
        self.sort(SortService.sortForName(self.sort(),
            columnName, self.sorts));
    };

    //Manipulating daily features

    /**
     * Resets all short-rest features.
     */
    self.resetShortRestFeatures = function() {
        ko.utils.arrayForEach(self.dailyFeatures(), function(feature) {
            if (feature.featureResetsOn() === DailyFeature.REST_VALUES.SHORT_REST) {
                feature.featureUsed(0);
            }
        });
    };

    /**
     * Resets all long-rest features.
     */
    self.resetLongRestFeatures = function() {
        ko.utils.arrayForEach(self.dailyFeatures(), function(feature) {
            if (feature.featureResetsOn() === DailyFeature.REST_VALUES.LONG_REST ||
                feature.featureResetsOn() === DailyFeature.REST_VALUES.SHORT_REST) {
                feature.featureUsed(0);
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

    self.editModalOpen = function() {
        self.editHasFocus(true);
    };

    self.editDailyFeature = function(dailyFeature) {
        self.selecteditem(dailyFeature);
    };

    self.addDailyFeature = function() {
        var dailyFeature = self.blankDailyFeature();
        dailyFeature.characterId(CharacterManager.activeCharacter().key());
        dailyFeature.color(Fixtures.general.colorList[self.dailyFeatures().length
          % Fixtures.general.colorList.length]);
        dailyFeature.save();
        self.dailyFeatures.push(dailyFeature);

        self.blankDailyFeature(new DailyFeature());
    };

    self.removeDailyFeature = function(dailyFeature) {
        self.dailyFeatures.remove(dailyFeature);
        dailyFeature.delete();
    };

    self.refreshDailyFeature = function(dailyFeature) {
        dailyFeature.featureUsed(0);
    };

    self.clear = function() {
        self.dailyFeatures([]);
    };
}

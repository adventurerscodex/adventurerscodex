import 'bin/knockout-bootstrap-modal';
import {
    CoreManager,
    Fixtures,
    Notifications,
    Utility } from 'charactersheet/utilities';
import {
    Feat,
    Feature,
    Tracked,
    Trait
} from 'charactersheet/models/character';
import { SortService } from 'charactersheet/services/common';
import campingTent from 'images/camping-tent-blue.svg';
import campingTentWhite from 'images/camping-tent.svg';
import ko from 'knockout';
import meditation from 'images/meditation-blue.svg';
import meditationWhite from 'images/meditation.svg';
import template from './index.html';

export function TrackerViewModel() {
    var self = this;

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc'},
        'name desc': { field: 'name', direction: 'desc'}
    };

    self.trackables = ko.observableArray([]);
    self.editItem = ko.observable();
    self.editParent = ko.observable();
    self.modalOpen = ko.observable(false);
    self.addFormIsValid = ko.observable(false);
    self.editModalTitle = ko.observable('');
    self.sort = ko.observable(self.sorts['name asc']);
    self.filter = ko.observable('');
    self.meditation = meditation;
    self.campingTent = campingTent;
    self.meditationWhite = meditationWhite;
    self.campingTentWhite = campingTentWhite;
    self.slotColors = Fixtures.general.colorList;

    self.load = function() {
        self.loadTrackedItems();

        //Notifications
        Notifications.events.shortRest.add(self.resetShortRestFeatures);
        Notifications.events.longRest.add(self.resetLongRestFeatures);
        Notifications.feat.changed.add(self.loadTrackedItems);
        Notifications.trait.changed.add(self.loadTrackedItems);
        Notifications.feature.changed.add(self.loadTrackedItems);
    };

    self.loadTrackedItems = async () => {
        var key = CoreManager.activeCore().uuid();
        var trackables = [];
        let trackedIndex = 0;

        // Fetch trackable objects
        var features = await Feature.ps.list({coreUuid: key});
        var feats = await Feat.ps.list({coreUuid: key});
        var traits = await Trait.ps.list({coreUuid: key});

        if (features.objects) {
            features = features.objects.filter((e, i, _) => {
                if (e.tracked()) {
                    e.tracked().type = 'Feature';
                    e.tracked().color = self.slotColors[trackedIndex % 17];
                    trackedIndex++;
                    return true;
                }
            });
            trackables = trackables.concat(features);
        }

        if (feats.objects) {
            feats = feats.objects.filter((e, i, _) => {
                if (e.tracked()) {
                    e.tracked().type = 'Feat';
                    e.tracked().color = self.slotColors[trackedIndex % 17];
                    trackedIndex++;
                    return true;
                }
            });
            trackables = trackables.concat(feats);
        }

        if (traits.objects) {
            traits = traits.objects.filter((e, i, _) => {
                if (e.tracked()) {
                    e.tracked().type = 'Trait';
                    e.tracked().color = self.slotColors[trackedIndex % 17];
                    trackedIndex++;
                    return true;
                }
            });
            trackables = trackables.concat(traits);
        }

        self.trackables(trackables);
        self.trackables().forEach(function(tracked) {
            tracked.tracked().max.subscribe(self.dataHasChanged, tracked);
            tracked.tracked().used.subscribe(self.dataHasChanged, tracked);
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

    self.validation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.modalFinishedClosing();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...Tracked.validationConstraints
    };

    self.modifierHasFocus = ko.observable(false);
    self.editHasFocus = ko.observable(false);

    self.modalFinishedAnimating = function() {
        self.modifierHasFocus(true);
    };

    self.modalFinishedClosing = async () => {
        if (self.modalOpen() && self.addFormIsValid()) {
            self.editParent().tracked().max(self.editItem().max());
            self.editParent().tracked().resetsOn(self.editItem().resetsOn());
            const response = await self.editParent().ps.save();
            Utility.array.updateElement(self.trackables(), response.object, response.object.uuid());
            switch(self.editItem().type()) {
            case 'Feature':
                Notifications.tracked.feature.changed.dispatch();
                break;
            case 'Trait':
                Notifications.tracked.trait.changed.dispatch();
                break;
            case 'Feat':
                Notifications.tracked.feat.changed.dispatch();
                break;
            }
        }

        self.modalOpen(false);
    };

    self.dataHasChanged = async function() {
        if (this.ps) {
            await this.ps.save();
            Notifications.tracked.changed.dispatch();
        }
    };

    self.editModalOpen = function() {
        self.editHasFocus(true);
    };

    self.editTracked = function(item) {
        switch(item.tracked().type) {
        case 'Feature':
            self.editParent(new Feature());
            self.editParent().importValues(item.exportValues());
            break;
        case 'Trait':
            self.editParent(new Trait());
            self.editParent().importValues(item.exportValues());
            break;
        case 'Feat':
            self.editParent(new Feat());
            self.editParent().importValues(item.exportValues());
            break;
        }
        self.editModalTitle(item.name());
        self.editItem(new Tracked());
        self.editItem().max(item.tracked().max());
        self.editItem().resetsOn(item.tracked().resetsOn());
        self.editItem().type(item.tracked().type);
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
});

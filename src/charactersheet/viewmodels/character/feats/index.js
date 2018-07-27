import 'bin/knockout-bootstrap-modal';
import {
    Feat,
    Tracked
} from 'charactersheet/models/character';
import { CoreManager } from 'charactersheet/utilities';
import { DataRepository } from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';
import { SortService } from 'charactersheet/services/common';
import { Utility } from 'charactersheet/utilities';
import campingTent from 'images/camping-tent.svg';
import ko from 'knockout';
import meditation from 'images/meditation.svg';
import template from './index.html';

export function FeatsViewModel() {
    var self = this;

    self.DESCRIPTION_MAX_LENGTH = 45;

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc'},
        'name desc': { field: 'name', direction: 'desc'}
    };

    self.feats = ko.observableArray([]);
    self.blankFeat = ko.observable(new Feat());
    self.blankTracked = ko.observable(new Tracked());
    self.modalOpen = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable(new Feat());
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

    self.load = async () => {
        await self.loadFeats();

        Notifications.tracked.feat.changed.add(self.loadFeats);
    };

    self.loadFeats = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await Feat.ps.list({coreUuid: key});
        self.feats(response.objects);
    };

    // Pre-pop methods
    self.featsPrePopFilter = function(request, response) {
        var term = request.term.toLowerCase();
        var keys = DataRepository.feats ? Object.keys(DataRepository.feats) : [];
        var results = keys.filter(function(name, idx, _) {
            return name.toLowerCase().indexOf(term) > -1;
        });
        response(results);
    };

    self.populateFeat = function(label, value) {
        var feat = DataRepository.feats[label];

        self.blankFeat().importValues(feat);
        self.shouldShowDisclaimer(true);
    };

    // Modal methods
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
            Utility.array.updateElement(self.feats(), response.object, self.editItemIndex);
        }

        self.currentEditItem(new Feat());
        self.currentEditTracked(new Tracked());
        self.modalOpen(false);
        Notifications.feat.changed.dispatch();
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

    self.filteredAndSortedFeats = ko.computed(function() {
        return SortService.sortAndFilter(self.feats(), self.sort(), null);
    });

    self.sortArrow = function(columnName) {
        return SortService.sortArrow(columnName, self.sort());
    };

    self.sortBy = function(columnName) {
        self.sort(SortService.sortForName(self.sort(), columnName, self.sorts));
    };

    self.addFeat = async () => {
        // TODO: Adding Feats that are pre pop don't work because of the Feat serializer.
        // TODO: It needs to be identical to the Feature one
        var feat = self.blankFeat();
        feat.coreUuid(CoreManager.activeCore().uuid());
        if (feat.isTracked()) {
            // todo: need logic to actually set the color
            self.blankTracked().color('progress-bar-sky');
            feat.tracked(self.blankTracked());
        }
        const newFeat = await feat.ps.create();
        self.feats.push(newFeat.object);
        self.blankFeat(new Feat());
        self.blankTracked(new Tracked());
    };

    self.clear = function() {
        self.feats([]);
    };

    self.removeFeat = async (feat) => {
        await feat.ps.delete();
        self.feats.remove(feat);
        Notifications.feat.changed.dispatch();
    };

    self.editFeat = function(feat) {
        self.editItemIndex = feat.uuid;
        self.currentEditItem(new Feat());
        self.currentEditItem().importValues(feat.exportValues());
        if (feat.tracked()) {
            self.currentEditItem().isTracked(true);
            self.currentEditTracked(feat.tracked());
        }
        self.modalOpen(true);
    };

    self.trackedPopoverText = function() {
        return 'Tracked Feats are listed in Feature Tracker.';
    };
}

ko.components.register('feats', {
    viewModel: FeatsViewModel,
    template: template
});

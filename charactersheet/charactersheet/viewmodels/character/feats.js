'use strict';

function FeatsViewModel() {
    var self = this;

    self.DESCRIPTION_MAX_LENGTH = 45;

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc'},
        'name desc': { field: 'name', direction: 'desc'},
        'description asc': { field: 'description', direction: 'asc'},
        'description desc': { field: 'description', direction: 'desc'}
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

    self.load = function() {
        Notifications.global.save.add(self.save);

        var key = CharacterManager.activeCharacter().key();
        self.feats(PersistenceService.findBy(Feat, 'characterId', key));
    };

    self.unload = function() {
        Notifications.global.save.remove(self.save);
    };

    self.save = function() {
        self.feats().forEach(function(e, i, _) {
            e.save();
        });
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
            }
            Utility.array.updateElement(self.feats(), self.currentEditItem(), self.editItemIndex);
        }

        self.save();
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
        self.sort(SortService.sortForName(self.sort(),
            columnName, self.sorts));
    };

    self.addFeat = function() {
        var feat = self.blankFeat();
        feat.characterId(CharacterManager.activeCharacter().key());
        if (feat.isTracked()) {
            feat.trackedId(uuid.v4());
            self.addTracked(feat.trackedId(), feat.characterId(), self.blankTracked());
        }
        feat.save();
        self.feats.push(feat);
        self.blankFeat(new Feat());
        self.blankTracked(new Tracked());
    };

    self.addTracked = function(uuid, characterId, tracked) {
        var newTracked = new Tracked();
        newTracked.characterId(characterId);
        newTracked.trackedId(uuid);
        newTracked.maxUses(tracked.maxUses());
        newTracked.resetsOn(tracked.resetsOn());
        newTracked.type(Feat);
        var trackedList = PersistenceService.findBy(Tracked, 'characterId', characterId);
        newTracked.color(Fixtures.general.colorList[trackedList.length
          % Fixtures.general.colorList.length]);
        newTracked.save();
    };

    self.clear = function() {
        self.feats([]);
    };

    self.removeFeat = function(feat) {
        if (feat.isTracked()) {
            var tracked = PersistenceService.findFirstBy(
                Tracked, 'trackedId', feat.trackedId());
            tracked.delete();
        }
        self.feats.remove(feat);
        feat.delete();
        Notifications.feat.changed.dispatch();
    };

    self.editFeat = function(feat) {
        self.editItemIndex = feat.__id;
        self.currentEditItem(new Feat());
        self.currentEditItem().importValues(feat.exportValues());
        if (feat.isTracked()) {
            self.currentEditTracked(PersistenceService.findFirstBy(Tracked, 'trackedId', feat.trackedId()));
        }
        self.modalOpen(true);
    };

    self.shortDescription = function(feat) {
        return Utility.string.truncateStringAtLength(feat.description(), self.DESCRIPTION_MAX_LENGTH);
    };

    self.trackedPopoverText = function() {
        return 'Tracked Feats are listed in Feature Tracker.';
    };
}

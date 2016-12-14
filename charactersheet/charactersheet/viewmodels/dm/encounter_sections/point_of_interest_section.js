'use strict';

function PointOfInterestSectionViewModel(parentEncounter) {
    var self = this;

    self.template = 'point_of_interest.tmpl';
    self.encounterId = parentEncounter.encounterId;
    self.characterId = ko.observable();

    self.visible = ko.observable();
    self.name = ko.observable();
    self.tagline = ko.observable();

    self.pointsOfInterest = ko.observableArray();

    self.blankPointOfInterest = ko.observable(new PointOfInterest());
    self.selecteditem = ko.observable();
    self.openModal = ko.observable(false);
    self.firstElementInModalHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc' },
        'name desc': { field: 'name', direction: 'desc' },
        'description asc': { field: 'description', direction: 'asc' },
        'description desc': { field: 'description', direction: 'desc' }
    };

    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['name asc']);

    /* Public Methods */

    self.init = function() {
        Notifications.global.save.add(self.save);
        Notifications.encounters.changed.add(self._dataHasChanged);
    };

    self.load = function() {
        var key = CharacterManager.activeCharacter().key();
        var poi = PersistenceService.findBy(PointOfInterest, 'encounterId', self.encounterId());
        if (poi) {
            self.pointsOfInterest(poi);
        }

        var section = PersistenceService.findFirstBy(PointOfInterestSection, 'encounterId', self.encounterId());
        if (!section) {
            section = new PointOfInterestSection();
            section.encounterId(self.encounterId());
            section.characterId(key);
        }
        self.name(section.name());
        self.visible(section.visible());
        self.tagline(section.tagline());
    };

    self.unload = function() {

    };

    self.save = function() {
        var key = CharacterManager.activeCharacter().key();
        var section = PersistenceService.findFirstBy(PointOfInterestSection, 'encounterId', self.encounterId());
        if (!section) {
            section = new PointOfInterestSection();
            section.encounterId(self.encounterId());
            section.characterId(key);
        }

        section.name(self.name());
        section.visible(self.visible());
        section.save();

        self.pointsOfInterest().forEach(function(poi, idx, _) {
            poi.save();
        });
    };

    self.delete = function() {
        var section = PersistenceService.findFirstBy(PointOfInterestSection, 'encounterId', self.encounterId());
        if (section) {
            section.delete();
        }

        self.pointsOfInterest().forEach(function(poi, idx, _) {
            poi.delete();
        });
    };

    /* UI Methods */

    /**
     * Filters and sorts the weaponss for presentation in a table.
     */
    self.filteredAndSortedPointsOfInterest = ko.computed(function() {
        return SortService.sortAndFilter(self.pointsOfInterest(), self.sort(), null);
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

    self.addPointOfInterest = function() {
        var poi = self.blankPointOfInterest();
        poi.characterId(CharacterManager.activeCharacter().key());
        poi.encounterId(self.encounterId());
        poi.save();
        self.pointsOfInterest.push(poi);
        self.blankPointOfInterest(new PointOfInterest());
    };

    self.removePointOfInterest = function(poi) {
        poi.delete();
        self.pointsOfInterest.remove(poi);
    };

    self.editPointOfInterest = function(poi) {
        self.selecteditem(poi);
    };

    self.toggleModal = function() {
        self.openModal(!self.openModal());
    };

    /* Modal Methods */

    self.modalFinishedOpening = function() {
        self.firstElementInModalHasFocus(true);
    };

    self.modalFinishedClosing = function() {
        self.selectPreviewTab();
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

    /* Private Methods */

    self._dataHasChanged = function() {
        var key = CharacterManager.activeCharacter().key();
        var poi = PersistenceService.findBy(PointOfInterest, 'encounterId', self.encounterId());
        if (poi) {
            self.pointsOfInterest(poi);
        }

        var section = PersistenceService.findFirstBy(PointOfInterestSection, 'encounterId', self.encounterId());
        if (!section) {
            section = new PointOfInterestSection();
            section.encounterId(self.encounterId());
            section.characterId(key);
        }
        self.name(section.name());
        self.visible(section.visible());
    };
}

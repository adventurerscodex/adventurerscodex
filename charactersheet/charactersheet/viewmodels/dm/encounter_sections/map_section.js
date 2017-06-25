'use strict';

function MapSectionViewModel(parentEncounter) {
    var self = this;

    self.template = 'map_section.tmpl';
    self.encounterId = parentEncounter.encounterId;
    self.characterId = ko.observable();

    self.visible = ko.observable();
    self.name = ko.observable();
    self.tagline = ko.observable();

    self.maps = ko.observableArray();
    self.blankMap = ko.observable(new Map());
    self.openModal = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable();
    self.firstElementInModalHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc' },
        'name desc': { field: 'name', direction: 'desc' }
    };

    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['name asc']);

    /* Public Methods */
    self.load = function() {
        Notifications.global.save.add(self.save);
        Notifications.encounters.changed.add(self._dataHasChanged);

        var key = CharacterManager.activeCharacter().key();
        var map = PersistenceService.findBy(Map, 'encounterId', self.encounterId());
        if (map) {
            self.maps(map);
        }

        var section = PersistenceService.findFirstBy(MapSection, 'encounterId', self.encounterId());
        if (!section) {
            section = new MapSection();
            section.encounterId(self.encounterId());
            section.characterId(key);
        }
        self.name(section.name());
        self.visible(section.visible());
        self.tagline(section.tagline());
    };

    self.unload = function() {
        Notifications.global.save.remove(self.save);
        Notifications.encounters.changed.remove(self._dataHasChanged);
    };

    self.save = function() {
        var key = CharacterManager.activeCharacter().key();
        var section = PersistenceService.findFirstBy(MapSection, 'encounterId', self.encounterId());
        if (!section) {
            section = new MapSection();
            section.encounterId(self.encounterId());
            section.characterId(key);
        }

        section.name(self.name());
        section.visible(self.visible());
        section.save();

        self.maps().forEach(function(map, idx, _) {
            map.save();
        });
    };

    self.delete = function() {
        var section = PersistenceService.findFirstBy(MapSection, 'encounterId', self.encounterId());
        if (section) {
            section.delete();
        }

        self.maps().forEach(function(map, idx, _) {
            map.delete();
        });
    };

    /* UI Methods */

    /**
     * Filters and sorts the weaponss for presentation in a table.
     */
    self.filteredAndSortedMaps = ko.computed(function() {
        return SortService.sortAndFilter(self.maps(), self.sort(), null);
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

    self.addMap = function() {
        var map = self.blankMap();
        map.characterId(CharacterManager.activeCharacter().key());
        map.encounterId(self.encounterId());
        map.save();
        self.maps.push(map);
        self.blankMap(new Map());
    };

    self.removeMap = function(map) {
        map.delete();
        self.maps.remove(map);
    };

    self.editMap = function(map) {
        self.editItemIndex = map.__id;
        self.currentEditItem(new Map());
        self.currentEditItem().importValues(map.exportValues());
        self.openModal(true);
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

        if (self.openModal()) {
            Utility.array.updateElement(self.maps(), self.currentEditItem(), self.editItemIndex);
        }

        self.save();
        self.openModal(false);
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
        var map = PersistenceService.findBy(Map, 'encounterId', self.encounterId());
        if (map) {
            self.maps(map);
        }

        var section = PersistenceService.findFirstBy(MapSection, 'encounterId', self.encounterId());
        if (!section) {
            section = new MapSection();
            section.encounterId(self.encounterId());
            section.characterId(key);
        }
        self.name(section.name());
        self.visible(section.visible());
    };
}

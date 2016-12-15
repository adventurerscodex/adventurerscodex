'use strict';

function PlayerTextSectionViewModel(parentEncounter) {
    var self = this;

    self.template = 'player_text_section.tmpl';
    self.encounterId = parentEncounter.encounterId;
    self.characterId = ko.observable();

    self.visible = ko.observable();
    self.name = ko.observable();
    self.tagline = ko.observable();

    self.playerTexts = ko.observableArray();

    self.blankPlayerText = ko.observable(new PlayerText());
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
    self.sort = ko.observable(self.sorts['description asc']);

    /* Public Methods */

    self.init = function() {
        Notifications.global.save.add(self.save);
        Notifications.encounters.changed.add(self._dataHasChanged);
    };

    self.load = function() {
        var key = CharacterManager.activeCharacter().key();
        var playerTexts = PersistenceService.findBy(PlayerText, 'encounterId', self.encounterId());
        if (playerTexts) {
            self.playerTexts(playerTexts);
        }

        var section = PersistenceService.findFirstBy(PlayerTextSection, 'encounterId', self.encounterId());
        if (!section) {
            section = new PlayerTextSection();
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
        var section = PersistenceService.findFirstBy(PlayerTextSection, 'encounterId', self.encounterId());
        if (!section) {
            section = new PlayerTextSection();
            section.encounterId(self.encounterId());
            section.characterId(key);
        }

        section.name(self.name());
        section.visible(self.visible());
        section.save();

        self.playerTexts().forEach(function(playerText, idx, _) {
            playerText.save();
        });
    };

    self.delete = function() {
        var section = PersistenceService.findFirstBy(PlayerTextSection, 'encounterId', self.encounterId());
        if (section) {
            section.delete();
        }

        self.playerTexts().forEach(function(playerText, idx, _) {
            playerText.delete();
        });
    };

    /* UI Methods */

    /**
     * Filters and sorts the weaponss for presentation in a table.
     */
    self.filteredAndSortedPlayerText = ko.computed(function() {
        return SortService.sortAndFilter(self.playerTexts(), self.sort(), null);
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

    self.addPlayerText = function() {
        var playerText = self.blankPlayerText();
        playerText.characterId(CharacterManager.activeCharacter().key());
        playerText.encounterId(self.encounterId());
        playerText.save();
        self.playerTexts.push(playerText);
        self.blankPlayerText(new PlayerText());
    };

    self.removePlayerText = function(playerText) {
        playerText.delete();
        self.playerTexts.remove(playerText);
    };

    self.editPlayerText = function(playerText) {
        self.selecteditem(playerText);
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
        var playerTexts = PersistenceService.findBy(PlayerText, 'encounterId', self.encounterId());
        if (playerTexts) {
            self.playerTexts(playerTexts);
        }

        var section = PersistenceService.findFirstBy(PlayerTextSection, 'encounterId', self.encounterId());
        if (!section) {
            section = new PointOfInterestSection();
            section.encounterId(self.encounterId());
            section.characterId(key);
        }
        self.name(section.name());
        self.visible(section.visible());
    };
}

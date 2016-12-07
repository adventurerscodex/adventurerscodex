'use strict';

function TreasureSectionViewModel(parentEncounter) {
    var self = this;

    self.template = 'treasure_section.tmpl'
    self.encounterId = parentEncounter.encounterId;
    self.characterId = ko.observable();

    self.visible = ko.observable();
    self.name = ko.observable();

    self.treasure = ko.observableArray();

    /**
     * A list of types to accept/load into the treasure.
     */
    self.treasureTypes = [
      EncounterItem, EncounterWeapon, EncounterMagicItem, EncounterArmor, EncounterCoins
    ];

    self.blankTreasure = ko.observable(new EncounterWeapon());
    self.selecteditem = ko.observable();
    self.openModal = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');

    self.sorts = {
        'name asc': { field: 'weaponName', direction: 'asc' },
        'name desc': { field: 'weaponName', direction: 'desc' },
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
        var treasure = [];
        self.treasureTypes.forEach(function(type, idx, _){
            var result = PersistenceService.findBy(type, 'encounterId', self.encounterId());
            treasure = treasure.concat(result);
        });
        self.treasure(treasure);

        var section = PersistenceService.findFirstBy(TreasureSection, 'encounterId', self.encounterId());
        if (!section) {
            section = new TreasureSection();
            section.encounterId(self.encounterId());
            section.characterId(key);
        }
        self.name(section.name());
        self.visible(section.visible());
    };

    self.unload = function() {

    };

    self.save = function() {
        var key = CharacterManager.activeCharacter().key();
        var section = PersistenceService.findFirstBy(TreasureSection, 'encounterId', self.encounterId());
        if (!section) {
            section = new TreasureSection();
            section.encounterId(self.encounterId());
            section.characterId(key);
        }

        section.name(self.name());
        section.visible(self.visible());
        section.save();

        self.treasure().forEach(function(treasure, idx, _) {
            treasure.save();
        });
    };

    self.delete = function() {
        var section = PersistenceService.findFirstBy(TreasureSection, 'encounterId', self.encounterId());
        if (section) {
            section.delete();
        }

        self.treasure().forEach(function(treasure, idx, _) {
            treasure.delete();
        });
    };

    /* UI Methods */

    /**
     * Filters and sorts the weaponss for presentation in a table.
     */
    self.filteredAndSortedTreasure = ko.computed(function() {
        return SortService.sortAndFilter(self.treasure(), self.sort(), null);
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

    self.addTreasure = function() {
        var treasure = self.blankTreasure();
        treasure.characterId(CharacterManager.activeCharacter().key());
        treasure.encounterId(self.encounterId());
        treasure.save();
        self.treasure.push(treasure);
        self.blankTreasure(new Treasure());
    };

    self.removeTreasure = function(treasure) {
        treasure.delete();
        self.treasure.remove(treasure);
    };

    self.editTreasure = function(treasure) {
        self.selecteditem(treasure);
    };

    self.toggleModal = function() {
        self.openModal(!self.openModal());
    };

    /* Modal Methods */

    self.modalFinishedOpening = function() {

    };

    self.modalFinishedClosing = function() {

    };

    self.selectPreviewTab = function() {
        self.previewTabStatus('active');
        self.editTabStatus('');
    };

    self.selectEditTab = function() {
        self.editTabStatus('active');
        self.previewTabStatus('');
    };

    /* Private Methods */

    self._dataHasChanged = function() {
        var key = CharacterManager.activeCharacter().key();
        var treasure = [];
        self.treasureTypes.forEach(function(type, idx, _){
            var result = PersistenceService.findBy(type, 'encounterId', self.encounterId());
            treasure = treasure.concat(result);
        });
        self.treasure(treasure);

        var section = PersistenceService.findFirstBy(TreasureSection, 'encounterId', self.encounterId());
        if (!section) {
            section = new TreasureSection();
            section.encounterId(self.encounterId());
            section.characterId(key);
        }
        self.name(section.name());
        self.visible(section.visible());
    };
}

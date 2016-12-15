'use strict';

function NPCSectionViewModel(parentEncounter) {
    var self = this;

    self.template = 'npc_section.tmpl';
    self.encounterId = parentEncounter.encounterId;
    self.characterId = ko.observable();

    self.visible = ko.observable();
    self.name = ko.observable();
    self.tagline = ko.observable();

    self.npcs = ko.observableArray();

    self.blankNPC = ko.observable(new NPC());
    self.selecteditem = ko.observable();
    self.openModal = ko.observable(false);
    self.firstElementInModalHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc' },
        'name desc': { field: 'name', direction: 'desc' },
        'race asc': { field: 'race', direction: 'asc' },
        'race desc': { field: 'race', direction: 'desc' },
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
        var npc = PersistenceService.findBy(NPC, 'encounterId', self.encounterId());
        if (npc) {
            self.npcs(npc);
        }

        var section = PersistenceService.findFirstBy(NPCSection, 'encounterId', self.encounterId());
        if (!section) {
            section = new NPCSection();
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
        var section = PersistenceService.findFirstBy(NPCSection, 'encounterId', self.encounterId());
        if (!section) {
            section = new NPCSection();
            section.encounterId(self.encounterId());
            section.characterId(key);
        }

        section.name(self.name());
        section.visible(self.visible());
        section.save();

        self.npcs().forEach(function(npc, idx, _) {
            npc.save();
        });
    };

    self.delete = function() {
        var section = PersistenceService.findFirstBy(NPCSection, 'encounterId', self.encounterId());
        if (section) {
            section.delete();
        }

        self.npcs().forEach(function(npc, idx, _) {
            npc.delete();
        });
    };

    /* UI Methods */

    /**
     * Filters and sorts the weaponss for presentation in a table.
     */
    self.filteredAndSortedNpcs = ko.computed(function() {
        return SortService.sortAndFilter(self.npcs(), self.sort(), null);
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

    self.addNPC = function() {
        var npc = self.blankNPC();
        npc.characterId(CharacterManager.activeCharacter().key());
        npc.encounterId(self.encounterId());
        npc.save();
        self.npcs.push(npc);
        self.blankNPC(new NPC());
    };

    self.removeNPC = function(npc) {
        npc.delete();
        self.npcs.remove(npc);
    };

    self.editNPC = function(npc) {
        self.selecteditem(npc);
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
        var npc = PersistenceService.findBy(NPC, 'encounterId', self.encounterId());
        if (npc) {
            self.npcs(npc);
        }

        var section = PersistenceService.findFirstBy(NPCSection, 'encounterId', self.encounterId());
        if (!section) {
            section = new NPCSection();
            section.encounterId(self.encounterId());
            section.characterId(key);
        }
        self.name(section.name());
        self.visible(section.visible());
    };
}

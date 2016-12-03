'use strict';

function MonsterSectionViewModel(parentEncounter) {
    var self = this;

    self.template = 'monster_section.tmpl'
    self.encounterId = parentEncounter.encounterId;
    self.characterId = ko.observable();

    self.visible = ko.observable();
    self.name = ko.observable();

    self.monsters = ko.observableArray();

    self.blankMonster = ko.observable(new Monster());
    self.selecteditem = ko.observable();
    self.openModal = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc' },
        'name desc': { field: 'name', direction: 'desc' },
        'armorClass asc': { field: 'armorClass', direction: 'asc' },
        'armorClass desc': { field: 'armorClass', direction: 'desc' },
        'hitPoints asc': { field: 'hitPoints', direction: 'asc' },
        'hitPoints desc': { field: 'hitPoints', direction: 'desc' },
        'speed asc': { field: 'speed', direction: 'asc' },
        'speed desc': { field: 'speed', direction: 'desc' },
        'experience asc': { field: 'experience', direction: 'asc' },
        'experience desc': { field: 'experience', direction: 'desc' }
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
        var monster = PersistenceService.findBy(Monster, 'encounterId', self.encounterId());
        if (monster) {
            self.monsters(monster);
        }

        var section = PersistenceService.findFirstBy(MonsterSection, 'encounterId', self.encounterId());
        if (!section) {
            section = new MonsterSection();
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
        var section = PersistenceService.findFirstBy(MonsterSection, 'encounterId', self.encounterId());
        if (!section) {
            section = new MonsterSection();
            section.encounterId(self.encounterId());
            section.characterId(key);
        }

        section.name(self.name());
        section.visible(self.visible());
        section.save();

        self.monsters().forEach(function(monster, idx, _) {
            monster.save();
        });
    };

    self.delete = function() {
        var section = PersistenceService.findFirstBy(MonsterSection, 'encounterId', self.encounterId());
        if (section) {
            section.delete();
        }

        self.monsters().forEach(function(monster, idx, _) {
            monster.delete();
        });
    };

    /* UI Methods */

    /**
     * Filters and sorts the monsters for presentation in a table.
     */
    self.filteredAndSortedMonsters = ko.computed(function() {
        return SortService.sortAndFilter(self.monsters(), self.sort(), null);
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

    self.addMonster = function() {
        var monster = self.blankMonster();
        monster.characterId(CharacterManager.activeCharacter().key());
        monster.encounterId(self.encounterId());
        monster.save();
        //add logic to create AS model for each stat entered
        self.monsters.push(monster);
        self.blankMonster(new Monster());
    };

    self.removeMonster = function(monster) {
        monster.delete();
        self.monsters.remove(monster);
    };

    self.editMonster = function(monster) {
        self.selecteditem(monster);
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
        var monster = PersistenceService.findBy(Monster, 'encounterId', self.encounterId());
        if (monster) {
            self.monsters(monster);
        }

        var section = PersistenceService.findFirstBy(MonsterSection, 'encounterId', self.encounterId());
        if (!section) {
            section = new MonsterSection();
            section.encounterId(self.encounterId());
            section.characterId(key);
        }
        self.name(section.name());
        self.visible(section.visible());
    };
}

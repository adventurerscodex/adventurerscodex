import {
    CoreManager,
    DataRepository,
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import {
    Monster,
    MonsterAbilityScore
} from 'charactersheet/models/dm';
import {
    SortService
} from 'charactersheet/services';
import ko from 'knockout';
import sectionIcon from 'images/encounters/wyvern.svg';
import template from './index.html';
import uuid from 'node-uuid';


export function MonsterSectionViewModel(params) {
    var self = this;

    self.sectionIcon = sectionIcon;
    self.encounter = params.encounter;
    self.encounterId = ko.pureComputed(function() {
        if (!self.encounter()) { return; }
        return self.encounter().uuid();
    });

    self.characterId = ko.observable();

    self.visible = ko.observable();
    self.name = ko.observable();
    self.tagline = ko.observable();

    self.monsters = ko.observableArray();
    self.blankMonster = ko.observable(new Monster());
    self.openModal = ko.observable(false);
    self.openEditModal = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable();
    self.firstElementInModalHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');
    self.shouldShowDisclaimer = ko.observable(false);
    self.addFormIsValid = ko.observable(false);

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
    self.load = async function() {
        Notifications.encounters.changed.add(self._dataHasChanged);


        self.encounter.subscribe(function() {
            self._dataHasChanged();
        });
        await self._dataHasChanged();
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

    self.addMonster = async function() {
        var monster = self.blankMonster();
        monster.coreUuid(CoreManager.activeCore().uuid());
        monster.encounterUuid(self.encounterId());

        const monsterResponse = await monster.ps.create();
        self.monsters.push(monsterResponse.object);
        self.openModal(!self.openModal());
        self.blankMonster(new Monster());
    };

    self.removeMonster = async function(monster) {
        await monster.ps.delete();
        self.monsters.remove(monster);
    };

    self.editMonster = function(monster) {
        self.editItemIndex = monster.uuid;
        self.currentEditItem(new Monster());
        self.currentEditItem().importValues(monster.exportValues());
        self.currentEditItem().abilityScores(monster.abilityScores().map(function(e, i, _) {
            var abilityScore = new MonsterAbilityScore();
            abilityScore.importValues(e);
            return abilityScore;
        }));
        self.openEditModal(true);
    };

    self.validation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.addMonster();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...Monster.validationConstraints
    };

    self.updateValidation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.modalFinishedClosing();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...Monster.validationConstraints
    };

    self.toggleModal = function() {
        var abilityScores = [
            { name: 'Strength', shortName: 'STR', value: 0},
            { name: 'Dexterity', shortName: 'DEX', value: 0},
            { name: 'Constitution', shortName: 'CON', value: 0},
            { name: 'Intelligence', shortName: 'INT', value: 0},
            { name: 'Wisdom', shortName: 'WIS', value: 0},
            { name: 'Charisma', shortName: 'CHA', value: 0}
        ];
        self.blankMonster().abilityScores(abilityScores);
        self.openModal(!self.openModal());
    };

    self.closeAddModal = () => {
        self.openModal(false);
    };

    self.closeModal = () => {
        self.openEditModal(false);
        self.selectPreviewTab();
    };

    self.renderAbilityScoresInAddModal = function() {
        if (self.blankMonster().abilityScores()[0]) {
            return true;
        } else {
            return false;
        }
    };

    self.monstersPrePopFilter = function(request, response) {
        var term = request.term.toLowerCase();
        var keys = DataRepository.monsters ? Object.keys(DataRepository.monsters) : [];
        var results = keys.filter(function(name, idx, _) {
            return name.toLowerCase().indexOf(term) > -1;
        });
        response(results);
    };

    self.populateMonster = function(label, value) {
        var monster = DataRepository.monsters[label];

        self.blankMonster().importValues(monster);
        self.blankMonster().abilityScores().forEach(function(score, idx, _) {
            score.name(monster.abilityScores[idx].name);
            score.value(monster.abilityScores[idx].value);
            score.shortName = ko.observable(score.name().substring(0,3).toUpperCase());
        });
        self.shouldShowDisclaimer(true);
    };

    /* Modal Methods */

    self.modalFinishedOpening = function() {
        self.shouldShowDisclaimer(false);
        self.firstElementInModalHasFocus(true);
    };

    self.modalFinishedClosing = async function() {
        self.openModal(false);
        self.selectPreviewTab();

        if (self.openEditModal()) {
            const response = await self.currentEditItem().ps.save();
            Utility.array.updateElement(self.monsters(), response.object, self.editItemIndex);
        }

        self.openEditModal(false);
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

    self._dataHasChanged = async function() {
        var coreUuid = CoreManager.activeCore().uuid();
        var monsterResponse = await Monster.ps.list({coreUuid, encounterUuid: self.encounterId()});
        self.monsters(monsterResponse.objects);
        var section = self.encounter().sections()[Fixtures.encounter.sections.monsters.index];
        self.name(section.name());
        self.visible(section.visible());
        self.tagline(section.tagline());
    };
}

ko.components.register('monster-section', {
    viewModel: MonsterSectionViewModel,
    template: template
});

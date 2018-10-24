import 'bin/knockout-bootstrap-modal';
import {
    CoreManager,
    DataRepository,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { SortService } from 'charactersheet/services/common';
import { Spell } from 'charactersheet/models';
import ko from 'knockout';
import template from './index.html';

export function SpellbookViewModel() {
    var self = this;

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc'},
        'name desc': { field: 'name', direction: 'desc'},
        'prepared asc': { field: 'prepared', direction: 'asc', booleanType: true},
        'prepared desc': { field: 'prepared', direction: 'desc', booleanType: true},
        'damageType asc': { field: 'damageType', direction: 'asc'},
        'damageType desc': { field: 'damageType', direction: 'desc'},
        'damage asc': { field: 'damage', direction: 'asc'},
        'damage desc': { field: 'damage', direction: 'desc'},
        'level asc': { field: 'level', direction: 'asc', numeric: true},
        'level desc': { field: 'level', direction: 'desc', numeric: true},
        'castingTime asc': { field: 'castingTime', direction: 'asc'},
        'castingTime desc': { field: 'castingTime', direction: 'desc'},
        'range asc': { field: 'range', direction: 'asc'},
        'range desc': { field: 'range', direction: 'desc'}
    };

    self.blankSpell = ko.observable(new Spell());
    self.spellbook = ko.observableArray([]);
    self.modalOpen = ko.observable(false);
    self.addFormIsValid = ko.observable(false);
    self.addModalOpen = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable();
    self.shouldShowDisclaimer = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');
    self.firstModalElementHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);
    self.spellSchoolIconCSS = ko.observable('');

    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['name asc']);

    self.numberOfPrepared = ko.computed(function(){
        var prepared = 0;
        self.spellbook().forEach(function(spell) {
            if (spell.prepared() === true) {
                prepared++;
            }
        });

        return prepared;
    });

    self.numberOfSpells = ko.computed(function() {
        return self.spellbook() ? self.spellbook().length : 0;
    });

    self.load = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await Spell.ps.list({coreUuid: key});
        self.spellbook(response.objects);
        self.spellbook().forEach(function(spell) {
            spell.prepared.subscribe(self.save, spell);
        });
        Notifications.spellStats.changed.add(self.valueHasChanged);
        self.valueHasChanged();
    };


    // Prepopulate methods
    self.populateSpell = function(label, value) {
        var spell = DataRepository.spells[label];

        self.blankSpell().importValues(spell);
        self.shouldShowDisclaimer(true);
    };

    self.setSpellSchool = function(label, value) {
        self.blankSpell().school(value);
    };

    self.setType = function(label, value) {
        self.blankSpell().type(value);
    };

    self.setSpellSaveAttr = function(label, value) {
        self.blankSpell().spellSaveAttribute(value);
    };

    self.setCastingTime = function(label, value) {
        self.blankSpell().castingTime(value);
    };

    self.setRange = function(label, value) {
        self.blankSpell().range(value);
    };

    self.setComponents = function(label, value) {
        self.blankSpell().components(value);
    };

    self.setDuration = function(label, value) {
        self.blankSpell().duration(value);
    };

    // Modal methods

    self.validation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.addSpell();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...Spell.validationConstraints
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
        ...Spell.validationConstraints
    };

    self.toggleAddModal = () => {
        self.addModalOpen(!self.addModalOpen());
    };

    self.closeAddModal = () => {
        self.addModalOpen(false);
    };

    self.modalFinishedOpening = function() {
        self.shouldShowDisclaimer(false);
        self.firstModalElementHasFocus(true);
    };

    self.modalFinishedClosing = async() => {
        self.previewTabStatus('active');
        self.editTabStatus('');
        self.firstModalElementHasFocus(false);
        self.spellSchoolIconCSS('');
        if (self.modalOpen()) {
            const response = await self.currentEditItem().ps.save();
            Utility.array.updateElement(self.spellbook(), response.object, self.editItemIndex);
            self.valueHasChanged();
        }

        self.modalOpen(false);
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

    self.closeEditModal = () => {
        self.modalOpen(false);
        self.selectPreviewTab();
    };

    self.determineSpellSchoolIcon = ko.computed(function() {
        if (self.currentEditItem() && self.currentEditItem().school()) {
            var spellSchool = self.currentEditItem().school();
            self.spellSchoolIconCSS(spellSchool.toLowerCase());
        }
    });

    /* UI Methods */

    /**
     * Popover for prepared spells
     */
    self.alwaysPreparedPopoverText = function() {
        return 'Always prepared spells will not count against total prepared spells.';
    };

    /**
     * Returns true if the spell prepared row should be visible in the add modal
     */
    self.preparedRowVisibleAdd = function() {
        return parseInt(self.blankSpell().level()) !== 0;
    };

    /**
     * Returns true if the spell prepared row should be visible in the edit modal
     */
    self.preparedRowVisibleEdit = function(spell) {
        return parseInt(spell.level()) !== 0;
    };

    /**
     * Filters and sorts the spells for presentation in a table.
     * Boolean sort logic inspired by:
     * http://stackoverflow.com/
     * questions/17387435/javascript-sort-array-of-objects-by-a-boolean-property
     */
    self.filteredAndSortedSpells = ko.computed(function() {
        return SortService.sortAndFilter(self.spellbook(), self.sort(), null);
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
        self.sort(SortService.sortForName(self.sort(),
            columnName, self.sorts));
    };

    self.spellsPrePopFilter = function(request, response) {
        var term = request.term.toLowerCase();
        var keys = DataRepository.spells ? Object.keys(DataRepository.spells) : [];
        var results = keys.filter(function(name, idx, _) {
            return name.toLowerCase().indexOf(term) > -1;
        });
        response(results);
    };

    // Manipulating spells
    self.addSpell = async () => {
        var spell = self.blankSpell();
        spell.coreUuid(CoreManager.activeCore().uuid());
        const newSpell = await spell.ps.create();
        newSpell.object.prepared.subscribe(self.save, newSpell.object);
        self.spellbook.push(newSpell.object);

        this.valueHasChanged();
        self.blankSpell(new Spell());
        self.toggleAddModal();
    };

    self.removeSpell = async (spell) => {
        await spell.ps.delete();
        self.spellbook.remove(spell);
    };

    self.editSpell = function(spell) {
        self.editItemIndex = spell.uuid;
        self.currentEditItem(new Spell());
        self.currentEditItem().importValues(spell.exportValues());
        self.currentEditItem().updateValues();
        self.modalOpen(true);
    };

    self.valueHasChanged = function() {
        self.spellbook().forEach(function(e) {
            e.updateValues();
        });
    };

    self.save = async function() {
        if (this.ps) {
            await this.ps.save();
        }
    };
}

ko.components.register('spells', {
    viewModel: SpellbookViewModel,
    template: template
});

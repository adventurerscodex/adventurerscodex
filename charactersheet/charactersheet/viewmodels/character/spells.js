'use strict';

function SpellbookViewModel() {
    var self = this;

    self.sorts = {
        'spellName asc': { field: 'spellName', direction: 'asc'},
        'spellName desc': { field: 'spellName', direction: 'desc'},
        'spellPrepared asc': { field: 'spellPrepared', direction: 'asc', booleanType: true},
        'spellPrepared desc': { field: 'spellPrepared', direction: 'desc', booleanType: true},
        'spellType asc': { field: 'spellType', direction: 'asc'},
        'spellType desc': { field: 'spellType', direction: 'desc'},
        'spellDmg asc': { field: 'spellDmg', direction: 'asc'},
        'spellDmg desc': { field: 'spellDmg', direction: 'desc'},
        'spellLevel asc': { field: 'spellLevel', direction: 'asc', numeric: true},
        'spellLevel desc': { field: 'spellLevel', direction: 'desc', numeric: true},
        'spellCastingTime asc': { field: 'spellCastingTime', direction: 'asc'},
        'spellCastingTime desc': { field: 'spellCastingTime', direction: 'desc'},
        'spellRange asc': { field: 'spellRange', direction: 'asc'},
        'spellRange desc': { field: 'spellRange', direction: 'desc'}
    };

    self.selecteditem = ko.observable();
    self.blankSpell = ko.observable(new Spell());
    self.spellbook = ko.observableArray([]);
    self.modalOpen = ko.observable(false);
    self.shouldShowDisclaimer = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');
    self.firstModalElementHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);
    self.spellSchoolIconCSS = ko.observable('');

    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['spellName asc']);

    self.numberOfPrepared = ko.computed(function(){
        var prepared = ko.utils.arrayFilter(self.spellbook(), function(spell) {
            return spell.spellPrepared() === true;
        });

        return prepared.length;
    });

    self.numberOfSpells = ko.computed(function() {
        return self.spellbook() ? self.spellbook().length : 0;
    });

    self.init = function() {
        Notifications.global.save.add(function() {
            self.spellbook().forEach(function(e, i, _) {
                e.save();
            });
        });
    };

    self.load = function() {
        var key = CharacterManager.activeCharacter().key();
        self.spellbook(Spell.findAllBy(key));
    };

    self.unload = function() {
        $.each(self.spellbook(), function(_, e) {
            e.save();
        });
    };

    self.populateSpell = function(label, value) {
        var spell = DataRepository.spells[label];

        self.blankSpell().importValues(spell);
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
        self.firstModalElementHasFocus(false);
        self.spellSchoolIconCSS('');
        self.previewTabStatus.valueHasMutated();
        self.editTabStatus.valueHasMutated();
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

    self.determineSpellSchoolIcon = ko.computed(function() {
        if (self.selecteditem() && self.selecteditem().spellSchool()) {
            var spellSchool = self.selecteditem().spellSchool();
            self.spellSchoolIconCSS(spellSchool.toLowerCase());
        }
    });

    /* UI Methods */

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

    //Manipulating spells
    self.addSpell = function() {
        var spell = self.blankSpell();
        spell.characterId(CharacterManager.activeCharacter().key());
        spell.save();
        self.spellbook.push(spell);
        self.blankSpell(new Spell());
    };

    self.removeSpell = function(spell) {
        self.spellbook.remove(spell);
        spell.delete();
    };

    self.editSpell = function(spell) {
        self.selecteditem(spell);
    };

    self.clear = function() {
        self.spellbook([]);
    };
}

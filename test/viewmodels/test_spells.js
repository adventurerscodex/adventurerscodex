import {
    CharacterManager,
    Notifications
} from 'charactersheet/utilities';
import {
    PersistenceService,
    SortService
} from 'charactersheet/services/common';
import { MockCharacterManager } from '../mocks';
import Should from 'should';
import { Spell } from 'charactersheet/models/common';
import { SpellbookViewModel } from 'charactersheet/viewmodels/character/spells';
import simple from 'simple-mock';

describe('SpellsViewModel', function(){
    PersistenceService._save = function(){};
    PersistenceService._delete = function(){};

    describe('Load', function() {
        it('should load the data from the spells db.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            PersistenceService.findBy = function(key) { return [new Spell(), new Spell()]; };
            var spellsVM = new SpellbookViewModel();
            spellsVM.spellbook().length.should.equal(0);
            spellsVM.load();
            spellsVM.spellbook().length.should.equal(2);
        });
    });

    describe('Add Spell', function() {
        it('should add a new spell to the SpellbookViewModel', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var book = new SpellbookViewModel();
            book.clear();
            book.spellbook().length.should.equal(0);
            book.addSpell();
            book.spellbook().length.should.equal(1);
        });
    });

    describe('Edit Spell', function() {
        it('should select a spell for editing.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var book = new SpellbookViewModel();

            var spell = new Spell();
            spell.spellName('Magic missle');
            book.editSpell(spell);
            book.currentEditItem().spellName().should.equal(spell.spellName());
            book.modalOpen().should.equal(true);
        });
    });

    describe('Remove Item', function() {
        it('should remove a item from the SpellbookViewModel', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var book = new SpellbookViewModel();
            book.clear();
            book.spellbook().length.should.equal(0);
            book.addSpell();
            book.spellbook().length.should.equal(1);
            book.removeSpell(book.spellbook().pop());
            book.spellbook().length.should.equal(0);
        });
    });

    describe('Clear', function() {
        it('should clear all the values in the SpellbookViewModel', function() {
            var book = new SpellbookViewModel();
            var spell = [new Spell()];
            book.spellbook(spell);
            book.spellbook().should.equal(spell);
            book.clear();
            book.spellbook().length.should.equal(0);
        });
    });

    describe('Sort By', function() {
        it('should sort the list of spells by given criteria', function() {
            var book = new SpellbookViewModel();
            book.sortBy('spellName');
            book.sort().should.equal(book.sorts['spellName desc']);
            book.sortBy('spellName');
            book.sort().should.equal(book.sorts['spellName asc']);
            book.sortBy('spellPrepared');
            book.sort().should.equal(book.sorts['spellPrepared asc']);
            book.sortBy('spellPrepared');
            book.sort().should.equal(book.sorts['spellPrepared desc']);
            book.sortBy('spellLevel');
            book.sort().should.equal(book.sorts['spellLevel asc']);
            book.sortBy('spellLevel');
            book.sort().should.equal(book.sorts['spellLevel desc']);
        });
    });

    describe('Sort Arrow', function() {
        it('should sort the list of skills by given criteria', function() {
            var book = new SpellbookViewModel();
            book.sortBy('spellName');
            book.sort().should.equal(book.sorts['spellName desc']);
            book.sortArrow('spellName').should.equal('fa fa-arrow-down fa-color');
            book.sortBy('spellPrepared');
            book.sort().should.equal(book.sorts['spellPrepared asc']);
            book.sortArrow('spellPrepared').should.equal('fa fa-arrow-up fa-color');
            book.sortArrow('spellLevel').should.equal('');
            book.sortBy('spellName');
            book.sort().should.equal(book.sorts['spellName asc']);
            book.sortArrow('spellName').should.equal('fa fa-arrow-up fa-color');
            book.sortArrow('spellLevel').should.equal('');
            //Numeric sort
            book.sortBy('spellLevel');
            book.sort().should.equal(book.sorts['spellLevel asc']);
            book.sortArrow('spellName').should.equal('');
            book.sortArrow('spellLevel').should.equal('fa fa-arrow-up fa-color');
            book.sortBy('spellLevel');
            book.sort().should.equal(book.sorts['spellLevel desc']);
            book.sortArrow('spellName').should.equal('');
            book.sortArrow('spellLevel').should.equal('fa fa-arrow-down fa-color');
        });
    });

    describe('Prepared Row Visible Add Modal', function() {
        it('should return true if the prepared row checkboxes should be visible', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var book = new SpellbookViewModel();
            book.blankSpell().spellLevel(1);
            book.preparedRowVisibleAdd().should.equal(true);
        });
        it('should return true if the prepared row checkboxes should be visible', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var book = new SpellbookViewModel();
            book.blankSpell().spellLevel(0);
            book.preparedRowVisibleAdd().should.equal(false);
        });
    });

    describe('Prepared Row Visible Edit Modal', function() {
        it('should return true if the prepared row checkboxes should be visible', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var book = new SpellbookViewModel();
            var spell = new Spell();
            spell.spellLevel(1);
            book.spellbook([spell]);
            book.preparedRowVisibleEdit(spell).should.equal(true);
        });
        it('should return true if the prepared row checkboxes should be visible', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var book = new SpellbookViewModel();
            var spell = new Spell();
            spell.spellLevel(0);
            book.spellbook([spell]);
            book.preparedRowVisibleEdit(spell).should.equal(false);
        });
    });

    describe('Should set autocomplete fields', function() {
        it('should set the value of spell school when an autocomplete is selected', function() {
            var book = new SpellbookViewModel();
            book.blankSpell().spellLevel(1);
            book.setSpellSchool('label', 'Fire');

            book.blankSpell().spellSchool().should.equal('Fire');
        });
        it('should set the value of spell type when an autocomplete is selected', function() {
            var book = new SpellbookViewModel();
            book.blankSpell().spellLevel(1);
            book.setSpellType('label', 'Attack Roll');

            book.blankSpell().spellType().should.equal('Attack Roll');
        });
        it('should set the value of spell save attr when an autocomplete is selected', function() {
            var book = new SpellbookViewModel();
            book.blankSpell().spellLevel(1);
            book.setSpellSaveAttr('label', 'Wis');

            book.blankSpell().spellSaveAttribute().should.equal('Wis');
        });
        it('should set the value of spell casting time when an autocomplete is selected', function() {
            var book = new SpellbookViewModel();
            book.blankSpell().spellLevel(1);
            book.setSpellCastingTime('label', '1 action');

            book.blankSpell().spellCastingTime().should.equal('1 action');
        });
        it('should set the value of spell range when an autocomplete is selected', function() {
            var book = new SpellbookViewModel();
            book.blankSpell().spellLevel(1);
            book.setSpellRange('label', '20 ft.');

            book.blankSpell().spellRange().should.equal('20 ft.');
        });
        it('should set the value of spell components when an autocomplete is selected', function() {
            var book = new SpellbookViewModel();
            book.blankSpell().spellLevel(1);
            book.setSpellComponents('label', 'S');

            book.blankSpell().spellComponents().should.equal('S');
        });
        it('should set the value of spell duration when an autocomplete is selected', function() {
            var book = new SpellbookViewModel();
            book.blankSpell().spellLevel(1);
            book.setSpellDuration('label', '1 hour');

            book.blankSpell().spellDuration().should.equal('1 hour');
        });
    });
});

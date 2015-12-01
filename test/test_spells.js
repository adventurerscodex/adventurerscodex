"use strict";

describe('SpellsViewModel', function(){
    var messenger = new Messenger();
    var players = new Players();
    PersistenceService._save = function(){};
    PersistenceService._delete = function(){};

	describe('Add Spell', function() {
		it('should add a new spell to the SpellbookViewModel', function() {
			var book = new SpellbookViewModel();
			book.clear();
			book.spellbook().length.should.equal(0);
			book.addSpell();
			book.spellbook().length.should.equal(1);
		});
	});

	describe('Remove Item', function() {
		it('should remove a item from the SpellbookViewModel', function() {
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
			book.sortArrow('spellName').should.equal('glyphicon glyphicon-arrow-down');
			book.sortArrow('spellLevel').should.equal('');
			book.sortBy('spellName');
			book.sort().should.equal(book.sorts['spellName asc']);
			book.sortArrow('spellName').should.equal('glyphicon glyphicon-arrow-up');
			book.sortArrow('spellLevel').should.equal('');
		});
	});
});

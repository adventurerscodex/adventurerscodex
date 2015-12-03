"use strict";

describe('SpellsViewModel', function(){
    var messenger = new Messenger();
    var players = new Players();
    PersistenceService._save = function(){};
    PersistenceService._delete = function(){};

	describe('Init', function() {
		it('should init the module.', function() {
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; }
				};
			};

			var spellsVM = new SpellbookViewModel();
			spellsVM.init();

			CharacterManager.activeCharacter = c;
		});
	});
    
	describe('Load', function() {
		it('should load the data from the spells db.', function() {
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; }
				};
			};

			Spell.findAllBy = function(key) { return [new Spell(), new Spell()]; };
			var spellsVM = new SpellbookViewModel();
			spellsVM.spellbook().length.should.equal(0);
			spellsVM.load();
			spellsVM.spellbook().length.should.equal(2);

			CharacterManager.activeCharacter = c;
		});
	});
	
	describe('Unload', function() {
		it('should unload the data to the spells db.', function() {
			//Shims
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; }
				};
			};

			var saved = [false, false];
			var spells = [new Spell(), new Spell()].map(function(e, i, _) {
				e.save = function() { saved[i] = true; }
				return e;
			});
			Spell.findAllBy = function(key) { return spells; };
			
			saved.forEach(function(e, i, _) {
				e.should.equal(false);
			});
			//Test
 			var spellsVM = new SpellbookViewModel();
 			spellsVM.spellbook().length.should.equal(0);
 			spellsVM.load();
  			spellsVM.spellbook().length.should.equal(2);
 			spellsVM.unload();
  			spellsVM.spellbook().length.should.equal(2);
  			
 			saved.forEach(function(e, i, _) {
				e.should.equal(true);
			});

			CharacterManager.activeCharacter = c;
		});
	});

	describe('Add Spell', function() {
		it('should add a new spell to the SpellbookViewModel', function() {
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; }
				};
			};

			var book = new SpellbookViewModel();
			book.clear();
			book.spellbook().length.should.equal(0);
			book.addSpell();
			book.spellbook().length.should.equal(1);

			CharacterManager.activeCharacter = c;
		});
	});

	describe('Edit Spell', function() {
		it('should select a spell for editing.', function() {
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; }
				};
			};

			var book = new SpellbookViewModel();
			book.spellbook().length.should.equal(0);
			book.addSpell();
			book.spellbook().length.should.equal(1);
			var spell = book.spellbook.pop();
			book.editSpell(spell);
			book.selecteditem().should.equal(spell)

			CharacterManager.activeCharacter = c;
		});
	});

	describe('Remove Item', function() {
		it('should remove a item from the SpellbookViewModel', function() {
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; }
				};
			};

			var book = new SpellbookViewModel();
			book.clear();
			book.spellbook().length.should.equal(0);
			book.addSpell();
			book.spellbook().length.should.equal(1);
			book.removeSpell(book.spellbook().pop());
			book.spellbook().length.should.equal(0);

			CharacterManager.activeCharacter = c;
		});
	});

	describe('Clear', function() {
		it('should clear all the values in the SpellbookViewModel', function() {
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; }
				};
			};

			var book = new SpellbookViewModel();
			var spell = [new Spell()];
			book.spellbook(spell);
			book.spellbook().should.equal(spell);
			book.clear();
			book.spellbook().length.should.equal(0);

			CharacterManager.activeCharacter = c;
		});
	});

	describe('Sort By', function() {
		it('should sort the list of spells by given criteria', function() {
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; }
				};
			};

			var book = new SpellbookViewModel();
			book.sortBy('spellName');
			book.sort().should.equal(book.sorts['spellName desc']);
			book.sortBy('spellName');
			book.sort().should.equal(book.sorts['spellName asc']);
			book.sortBy('spellLevel');
			book.sort().should.equal(book.sorts['spellLevel asc']);
			book.sortBy('spellLevel');
			book.sort().should.equal(book.sorts['spellLevel desc']);

			CharacterManager.activeCharacter = c;
		});
	});

	describe('Sort Arrow', function() {
		it('should sort the list of skills by given criteria', function() {
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; }
				};
			};

			var book = new SpellbookViewModel();
			book.sortBy('spellName');
			book.sort().should.equal(book.sorts['spellName desc']);
			book.sortArrow('spellName').should.equal('glyphicon glyphicon-arrow-down');
			book.sortArrow('spellLevel').should.equal('');
			book.sortBy('spellName');
			book.sort().should.equal(book.sorts['spellName asc']);
			book.sortArrow('spellName').should.equal('glyphicon glyphicon-arrow-up');
			book.sortArrow('spellLevel').should.equal('');
			//Numeric sort
			book.sortBy('spellLevel');
			book.sort().should.equal(book.sorts['spellLevel asc']);
			book.sortArrow('spellName').should.equal('');
			book.sortArrow('spellLevel').should.equal('glyphicon glyphicon-arrow-up');
			book.sortBy('spellLevel');
			book.sort().should.equal(book.sorts['spellLevel desc']);
			book.sortArrow('spellName').should.equal('');
			book.sortArrow('spellLevel').should.equal('glyphicon glyphicon-arrow-down');

			CharacterManager.activeCharacter = c;
		});
	});
});

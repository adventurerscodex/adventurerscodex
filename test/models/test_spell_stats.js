"use strict";

describe('SpellStats Model', function() {
	describe('Clear', function() {
		it('should clear all the values', function() {
			var pc_stats = new SpellStats();
			pc_stats.spellcastingAbility('INT');
			pc_stats.spellcastingAbility().should.equal('INT');
			pc_stats.clear();
			pc_stats.spellcastingAbility().should.equal('');
		});
	});

	describe('Import', function() {
		it('should import the values.', function() {
			var ft = new SpellStats();
			var e = {
				spellcastingAbility: 'INT'
			};
			ft.spellcastingAbility().should.equal('');
			ft.importValues(e);
			ft.spellcastingAbility().should.equal(e.spellcastingAbility);
		});
	});

	describe('Export', function() {
		it('should export the values.', function() {
			var ft = new SpellStats();
			ft.spellcastingAbility('INT');
			ft.spellcastingAbility().should.equal('INT');
			var e = ft.exportValues();
			ft.spellcastingAbility().should.equal(e.spellcastingAbility);
		});
	});

	describe('Save', function() {
		it('should save the values.', function() {
			var ft = new SpellStats();
			var saved = false;
			ft.ps.save = function() { saved = true; };

			saved.should.equal(false);
			ft.save();
			saved.should.equal(true);
		});
	});

	describe('Find By', function() {
		it('should find all of the values in the db.', function() {
			var key = '1234';
			simple.mock(PersistenceService, 'findAll').returnWith([new SpellStats()]);
			var r = SpellStats.findBy(key);
			r.length.should.equal(0);


			simple.mock(PersistenceService, 'findAll').returnWith([new SpellStats()].map(function(e, i, _) {
				e.characterId(key);
				return e;
			}));
			var r = SpellStats.findBy(key);
			r.length.should.equal(1);
		});
	});
});

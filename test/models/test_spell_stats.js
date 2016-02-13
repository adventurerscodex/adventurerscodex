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
});

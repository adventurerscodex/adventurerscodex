"use strict";


describe('SpellStats', function() {
	var spell_stats_fixture = {
		spell_stats: {
			"spellcastingAbility":"INT",
			"spellSaveDc":3,
			"spellAttackBonus":4,
		}
	};
	describe('Clear', function() {
		it('should clear all the values', function() {
			var pc_stats = new SpellStatsViewModel();
			pc_stats.spellStats.spellcastingAbility('INT');
			pc_stats.spellStats.spellcastingAbility().should.equal('INT');
			pc_stats.clear();
			pc_stats.spellStats.spellcastingAbility().should.equal('');
		});
	});
});

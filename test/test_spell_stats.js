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
      pc_stats.spell_stats().spellcastingAbility('INT');
      pc_stats.spell_stats().spellcastingAbility().should.equal('INT');
      pc_stats.clear();
      pc_stats.spell_stats().spellcastingAbility().should.equal('');
    });
  });

  describe('Export', function() {
    it('should yield an object with all the info supplied.', function() {
      var pc_stats = new SpellStatsViewModel();
      pc_stats.spell_stats().spellcastingAbility('INT');
      pc_stats.spell_stats().spellSaveDc(1);
      pc_stats.spell_stats().spellAttackBonus(2);
      var pc_exports = pc_stats.exportValues();
      pc_stats.spell_stats().spellcastingAbility().should.equal(pc_exports.spell_stats.spellcastingAbility);
      pc_stats.spell_stats().spellSaveDc().should.equal(pc_exports.spell_stats.spellSaveDc);
      pc_stats.spell_stats().spellAttackBonus().should.equal(pc_exports.spell_stats.spellAttackBonus);
    });
  });

  describe('Import', function() {
    it('should import an object with all the info supplied.', function() {
      var pc_stats = new SpellStatsViewModel();
      pc_stats.importValues(spell_stats_fixture);
      pc_stats.spell_stats().spellcastingAbility().should.equal(spell_stats_fixture.spell_stats.spellcastingAbility);
      pc_stats.spell_stats().spellSaveDc().should.equal(spell_stats_fixture.spell_stats.spellSaveDc);
      pc_stats.spell_stats().spellAttackBonus().should.equal(spell_stats_fixture.spell_stats.spellAttackBonus);
    });
  });
});
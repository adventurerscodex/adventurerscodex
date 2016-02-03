"use strict";

describe('Ability Scores', function() {
	describe('Clear', function() {
		it('should clear all the values in it', function() {
			var scores = new AbilityScores();
			scores.str(AbilitiesFixture.str);
			scores.str().should.equal(AbilitiesFixture.str);
			scores.clear();
			Should.not.exist(scores.str());

			scores.dex(AbilitiesFixture.dex);
			scores.dex().should.equal(AbilitiesFixture.dex);
			scores.clear();
			Should.not.exist(scores.dex());

			scores.con(AbilitiesFixture.con);
			scores.con().should.equal(AbilitiesFixture.con);
			scores.clear();
			Should.not.exist(scores.con());

			scores.int(AbilitiesFixture.int);
			scores.int().should.equal(AbilitiesFixture.int);
			scores.clear();
			Should.not.exists(scores.int());

			scores.wis(AbilitiesFixture.wis);
			scores.wis().should.equal(AbilitiesFixture.wis);
			scores.clear();
			Should.not.exist(scores.wis());

			scores.cha(AbilitiesFixture.cha);
			scores.cha().should.equal(AbilitiesFixture.cha);
			scores.clear();
			Should.not.exist(scores.cha());
		});
	});

	describe('Import', function() {
		it('should import an object with all the info supplied.', function() {
			var scores = new AbilityScores();
			scores.importValues(AbilitiesFixture);
			scores.str().should.equal(AbilitiesFixture.str);
			scores.dex().should.equal(AbilitiesFixture.dex);
			scores.con().should.equal(AbilitiesFixture.con);
			scores.int().should.equal(AbilitiesFixture.int);
			scores.wis().should.equal(AbilitiesFixture.wis);
			scores.cha().should.equal(AbilitiesFixture.cha);
		});
	});

	describe('Export', function() {
		it('should yield an object with all the info supplied.', function() {
			var scores = new AbilityScores();
			scores.str(AbilitiesFixture.str);
			scores.dex(AbilitiesFixture.dex);
			scores.con(AbilitiesFixture.con);
			scores.int(AbilitiesFixture.int);
			scores.wis(AbilitiesFixture.wis);
			scores.cha(AbilitiesFixture.cha);
			var exported = scores.exportValues();
			exported.str.should.equal(scores.str());
			exported.dex.should.equal(scores.dex());
			exported.con.should.equal(scores.con());
			exported.int.should.equal(scores.int());
			exported.wis.should.equal(scores.wis());
			exported.cha.should.equal(scores.cha());
		});
	});

	describe('isNumeric', function() {
		it('should test if modifier is numeric', function() {
			var actual = isNumeric(15);
			actual.should.equal(true);
			var actual = isNumeric('');
			actual.should.equal(false);
		});
	});

	describe('Get Modifier', function() {
		it('should test if modifier is calculated correctly', function() {
			var actual = getModifier(15);
			actual.should.equal(2);
			var actual = getModifier(1);
			actual.should.equal(-5);
			var actual = getModifier(30);
			actual.should.equal(10);
			var actual = getModifier(16);
			actual.should.equal(3);
		});
	});

	describe('Get Str Modifier', function() {
		it('should test if modifier has a positive or negative prepended', function() {
			var actual = getStrModifier(15);
			actual.should.equal('+ 2');
			var actual = getStrModifier(1);
			actual.should.equal('- 5');
			var actual = getStrModifier(30);
			actual.should.equal('+ 10');
		});
	});

	describe('Modifier For', function() {
		it('given a string score, give the modifier', function() {
			var abilityScore = new AbilityScores();
			Should.not.exist(abilityScore.str());
			abilityScore.str(18);
			abilityScore.modifierFor('str').should.equal(4);
			Should.not.exist(abilityScore.dex());
			abilityScore.dex(18);
			abilityScore.modifierFor('dex').should.equal(4);
			Should.not.exist(abilityScore.con());
			abilityScore.con(18);
			abilityScore.modifierFor('con').should.equal(4);
			Should.not.exist(abilityScore.int());
			abilityScore.int(18);
			abilityScore.modifierFor('int').should.equal(4);
			Should.not.exist(abilityScore.wis());
			abilityScore.wis(18);
			abilityScore.modifierFor('wis').should.equal(4);
			Should.not.exist(abilityScore.cha());
			abilityScore.cha(18);
			abilityScore.modifierFor('cha').should.equal(4);
		});
	});

	describe('Save', function() {
		it('should save the object', function() {
			var abilityScore = new AbilityScores();
			var saved = false;
			abilityScore.ps.save = function() { saved = true; }
			saved.should.equal(false);

			abilityScore.save();
			saved.should.equal(true);
		});
	});

	describe('Find All', function() {
		it('should return all entries from the db.', function() {
			var key = '1234';
			var _findAll = PersistenceService.findAll;

			PersistenceService.findAll = function(_) { return [new AbilityScores(), new AbilityScores()]; };
			var r = AbilityScores.findBy(key);
			r.length.should.equal(0);

			var results = [new AbilityScores(), new AbilityScores()].map(function(e, i, _) {
				e.characterId(key);
				return e;
			});
			PersistenceService.findAll = function(_) { return results; };
			var r = AbilityScores.findBy(key);
			r.length.should.equal(2);

			PersistenceService.findAll = _findAll;
		});
	});
});

"use strict";

var abilities_fixture = {
	'str': 12,
	'dex': 13,
	'con': 14,
	'int': 16,
	'wis': 15,
	'cha': 18
};

describe('Ability Scores', function() {
	describe('Clear', function() {
		it('should clear all the values in it', function() {
			var scores = new AbilityScores();
			scores.str(abilities_fixture.str);
			scores.str().should.equal(abilities_fixture.str);
			scores.clear();
			scores.str().should.equal('');

			scores.dex(abilities_fixture.dex);
			scores.dex().should.equal(abilities_fixture.dex);
			scores.clear();
			scores.dex().should.equal('');

			scores.con(abilities_fixture.con);
			scores.con().should.equal(abilities_fixture.con);
			scores.clear();
			scores.con().should.equal('');

			scores.int(abilities_fixture.int);
			scores.int().should.equal(abilities_fixture.int);
			scores.clear();
			scores.int().should.equal('');

			scores.wis(abilities_fixture.wis);
			scores.wis().should.equal(abilities_fixture.wis);
			scores.clear();
			scores.wis().should.equal('');

			scores.cha(abilities_fixture.cha);
			scores.cha().should.equal(abilities_fixture.cha);
			scores.clear();
			scores.cha().should.equal('');
		});
	});

	describe('Import', function() {
		it('should import an object with all the info supplied.', function() {
			var scores = new AbilityScores();
			scores.importValues(abilities_fixture);
			scores.str().should.equal(abilities_fixture.str);
			scores.dex().should.equal(abilities_fixture.dex);
			scores.con().should.equal(abilities_fixture.con);
			scores.int().should.equal(abilities_fixture.int);
			scores.wis().should.equal(abilities_fixture.wis);
			scores.cha().should.equal(abilities_fixture.cha);
		});
	});

	describe('Export', function() {
		it('should yield an object with all the info supplied.', function() {
			var scores = new AbilityScores();
			scores.str(abilities_fixture.str);
			scores.dex(abilities_fixture.dex);
			scores.con(abilities_fixture.con);
			scores.int(abilities_fixture.int);
			scores.wis(abilities_fixture.wis);
			scores.cha(abilities_fixture.cha);
			var exported = scores.exportValues();
			exported.str.should.equal(scores.str());
			exported.dex.should.equal(scores.dex());
			exported.con.should.equal(scores.con());
			exported.int.should.equal(scores.int());
			exported.wis.should.equal(scores.wis());
			exported.cha.should.equal(scores.cha());
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
			abilityScore.str().should.equal('');
			abilityScore.str(18);
			abilityScore.modifierFor('str').should.equal(4);
			abilityScore.dex().should.equal('');
			abilityScore.dex(18);
			abilityScore.modifierFor('dex').should.equal(4);
			abilityScore.con().should.equal('');
			abilityScore.con(18);
			abilityScore.modifierFor('con').should.equal(4);
			abilityScore.int().should.equal('');
			abilityScore.int(18);
			abilityScore.modifierFor('int').should.equal(4);
			abilityScore.wis().should.equal('');
			abilityScore.wis(18);
			abilityScore.modifierFor('wis').should.equal(4);
			abilityScore.cha().should.equal('');
			abilityScore.cha(18);
			abilityScore.modifierFor('cha').should.equal(4);
		});
	});

	describe('Save', function() {
		it('should save the object and send a signal', function() {
			var abilityScore = new AbilityScores();
			var sent = false;
			var saved = false;
			AbilityScoresSignaler.changed.add(function() { sent = true; });
			abilityScore.ps.save = function() { saved = true; }
			sent.should.equal(false);
			saved.should.equal(false);

			abilityScore.save();
			sent.should.equal(true);
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

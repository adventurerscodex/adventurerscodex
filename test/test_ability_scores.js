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
        scores.str().should.equal(18);

        scores.dex(abilities_fixture.dex);
        scores.dex().should.equal(abilities_fixture.dex);
        scores.clear();
        scores.dex().should.equal(18);

        scores.con(abilities_fixture.con);
        scores.con().should.equal(abilities_fixture.con);
        scores.clear();
        scores.con().should.equal(18);

        scores.int(abilities_fixture.int);
        scores.int().should.equal(abilities_fixture.int);
        scores.clear();
        scores.int().should.equal(18);

        scores.wis(abilities_fixture.wis);
        scores.wis().should.equal(abilities_fixture.wis);
        scores.clear();
        scores.wis().should.equal(18);

        scores.cha(abilities_fixture.cha);
        scores.cha().should.equal(abilities_fixture.cha);
        scores.clear();
        scores.cha().should.equal(18);
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
});
  "use strict";

  var values = {
    'feats': 'tough',
    'proficiencies': 'simple weapons'
  };

  describe('FeatsProfViewModel', function() {
    describe('Clear', function() {
      it('should clear all the values in it', function() {
        var profFeats = new FeatsProfViewModel();
        profFeats.feats(values.feats);
        profFeats.feats().should.equal(values.feats);
        profFeats.clear();
        profFeats.feats().should.equal('');
      });
    });

  describe('Import', function() {
    it('should import an object with all the info supplied.', function() {
      var profFeats = new FeatsProfViewModel();
      profFeats.importValues(values);
      profFeats.feats().should.equal(values.feats);
      profFeats.proficiencies().should.equal(values.proficiencies);
    });
  });

  describe('Export', function() {
    it('should yield an object with all the info supplied.', function() {
      var profFeats = new FeatsProfViewModel();
      profFeats.feats(values.feats);
      profFeats.proficiencies(values.proficiencies);
      var exported = profFeats.exportValues();
      exported.feats.should.equal(profFeats.feats());
      exported.proficiencies.should.equal(profFeats.proficiencies());
    });
  });
});
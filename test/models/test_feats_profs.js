"use strict";
describe('FeatsProf Model', function() {
    describe('Clear', function() {
        it('should clear all the FeatsProfFixture in it', function() {
            var profFeats = new FeatsProf();
            profFeats.feats(FeatsProfFixture.feats);
            profFeats.feats().should.equal(FeatsProfFixture.feats);
            profFeats.clear();
            profFeats.feats().should.equal('');
        });
    });

    describe('Import', function() {
        it('should import an object with all the info supplied.', function() {
            var profFeats = new FeatsProf();
            profFeats.importValues(FeatsProfFixture);
            profFeats.feats().should.equal(FeatsProfFixture.feats);
            profFeats.proficiencies().should.equal(FeatsProfFixture.proficiencies);
            profFeats.specialAbilities().should.equal(FeatsProfFixture.specialAbilities);
        });
    });

    describe('Export', function() {
        it('should yield an object with all the info supplied.', function() {
            var profFeats = new FeatsProf();
            profFeats.feats(FeatsProfFixture.feats);
            profFeats.proficiencies(FeatsProfFixture.proficiencies);
            profFeats.proficiencies(FeatsProfFixture.specialAbilities);
            var exported = profFeats.exportValues();
            exported.feats.should.equal(profFeats.feats());
            exported.proficiencies.should.equal(profFeats.proficiencies());
            exported.specialAbilities.should.equal(profFeats.specialAbilities());
        });
    });
});

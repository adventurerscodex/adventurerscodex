'use strict';

describe('Daily Features View Model', function() {
    describe('Add daily features', function() {
        it('should add a new daily feature to the list of daily features', function() {
            var c = CharacterManager.activeCharacter;
            CharacterManager.activeCharacter = function() {
                return {
                    key: function() { return '1234'; }
                };
            };

            var p = new DailyFeatureViewModel();
            p.dailyFeatures().length.should.equal(0);
            p.addDailyFeature();
            p.dailyFeatures().length.should.equal(1);

            CharacterManager.activeCharacter = c;
        });
    });

    describe('Remove daily feature', function() {
        it('should remove a feature from the list of dailyFeatures', function() {
            var c = CharacterManager.activeCharacter;
            CharacterManager.activeCharacter = function() {
                return {
                    key: function() { return '1234'; }
                };
            };

            var p = new DailyFeatureViewModel();
            p.dailyFeatures().length.should.equal(0);
            p.addDailyFeature();
            p.dailyFeatures().length.should.equal(1);
            p.removeDailyFeature(p.dailyFeatures().pop());
            p.dailyFeatures().length.should.equal(0);

            CharacterManager.activeCharacter = c;
        });
    });

    describe('Sort By', function() {
        it('should sort the list of dailyFeatures by given criteria', function() {
            var p = new DailyFeatureViewModel();
            p.sortBy('featureName');
            p.sort().should.equal(p.sorts['featureName desc']);
            p.sortBy('featureName');
            p.sort().should.equal(p.sorts['featureName asc']);
            p.sortBy('featureMaxUses');
            p.sort().should.equal(p.sorts['featureMaxUses asc']);
            p.sortBy('featureMaxUses');
            p.sort().should.equal(p.sorts['featureMaxUses desc']);
            p.sortBy('featureResetsOn');
            p.sort().should.equal(p.sorts['featureResetsOn asc']);
            p.sortBy('featureResetsOn');
            p.sort().should.equal(p.sorts['featureResetsOn desc']);
        });
    });

    describe('Sort Arrow', function() {
        it('should sort the list of dailyFeatures by given criteria', function() {
            var p = new DailyFeatureViewModel();
            p.sortBy('featureName');
            p.sort().should.equal(p.sorts['featureName desc']);
            p.sortArrow('featureName').should.equal('fa fa-arrow-down fa-color');
            p.sortArrow('featureMaxUses').should.equal('');
            p.sortBy('featureName');
            p.sort().should.equal(p.sorts['featureName asc']);
            p.sortArrow('featureName').should.equal('fa fa-arrow-up fa-color');
            p.sortArrow('featureMaxUses').should.equal('');
            p.sortBy('featureResetsOn');
            p.sort().should.equal(p.sorts['featureResetsOn asc']);
            p.sortArrow('featureResetsOn').should.equal('fa fa-arrow-up fa-color');
            p.sortArrow('featureMaxUses').should.equal('');
            p.sortArrow('featureName').should.equal('');
        });
    });

    describe('Max daily feature Width', function() {
        it('should return the width of the daily feature bar as a percent.', function() {
            var c = CharacterManager.activeCharacter;
            CharacterManager.activeCharacter = function() {
                return {
                    key: function() { return '1234'; }
                };
            };

            var p = new DailyFeatureViewModel();
            p.addDailyFeature();
            p.addDailyFeature();
            p.addDailyFeature();
            p.addDailyFeature();
            p.maxFeatureWidth().should.equal(25);

            CharacterManager.activeCharacter = c;
        });
    });

    describe('Reset dailyFeatures', function() {
        it('should reset a daily features counts to 0.', function() {
            var c = CharacterManager.activeCharacter;
            CharacterManager.activeCharacter = function() {
                return {
                    key: function() { return '1234'; }
                };
            };

            var p = new DailyFeatureViewModel();
            p.blankDailyFeature().featureMaxUses(5);
            p.addDailyFeature();

            p.dailyFeatures()[0].featureUsed(1);

            p.refreshDailyFeature(p.dailyFeatures()[0]);
            p.dailyFeatures()[0].featureUsed().should.equal(0);

            CharacterManager.activeCharacter = c;
        });
    });

    describe('Clear', function() {
        it('should clear all the values in spell dailyFeatures.', function() {
            var p = new DailyFeatureViewModel();
            var dailyFeatures = [df];
            p.dailyFeatures(dailyFeatures);
            p.dailyFeatures().should.equal(dailyFeatures);
            p.clear();
            p.dailyFeatures().length.should.equal(0);
        });
    });
});

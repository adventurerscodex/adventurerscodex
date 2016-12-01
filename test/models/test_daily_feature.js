'use strict';

describe('Daily Feature Model', function() {
    describe('Daily Feature', function() {
        it('should yield the number of total daily features remaining.', function() {
            var s = new DailyFeature();
            s.featureMaxUses(4);
            s.featureUsed(1);
            s.currentFeaturesAvailable().should.equal(3);
        });
    });

    describe('Clear', function() {
        it('should clear all values', function() {
            var s = new DailyFeature();
            s.featureMaxUses(4);
            s.featureUsed(1);

            s.featureMaxUses().should.equal(4);
            s.featureUsed().should.equal(1);
            s.clear();
            s.featureMaxUses().should.equal(0);
            s.featureUsed().should.equal(0);
        });
    });

    describe('Export', function() {
        it('should yield an object with all the info supplied.', function() {
            var p = new DailyFeature();
            p.featureMaxUses(10);
            p.featureUsed(10);

            p.featureMaxUses().should.equal(10);
            p.featureUsed().should.equal(10);
            var e = p.exportValues();
            e.featureMaxUses.should.equal(10);
            e.featureUsed.should.equal(10);
        });
    });

    describe('Import', function() {
        it('should import an object with all the info supplied.', function() {
            var s = new DailyFeature();
            s.featureMaxUses(0);
            s.featureUsed(0);

            var vals = { featureMaxUses: 3, featureUsed: 1 };
            s.importValues(vals);
            s.featureUsed().should.equal(vals.featureUsed);
            s.featureMaxUses().should.equal(vals.featureMaxUses);
        });
    });

    describe('Resets On Img Source', function() {
        it('should return the correct path for the image', function() {
            var s = new DailyFeature();

            s.featureResetsOn('long');
            s.resetsOnImgSource().should.equal('/images/camping-tent-blue.svg');

        });

        it('should return the correct path for the image', function() {
            var s = new DailyFeature();

            s.featureResetsOn('short');
            s.resetsOnImgSource().should.equal('/images/meditation-blue.svg');

        });


    });
});

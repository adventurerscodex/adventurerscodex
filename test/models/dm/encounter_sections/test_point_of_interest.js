import Should from 'should';
import simple from 'simple-mock';

import { PointOfInterest } from 'charactersheet/models';

describe('PointOfInterest', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Save', function() {
        it('should save pointOfInterest', function() {
            var pointOfInterest = new PointOfInterest();
            var pointOfInterestSpy = simple.mock(pointOfInterest.ps, 'save');

            pointOfInterest.save();
            pointOfInterestSpy.called.should.equal(true);
        });
    });

    describe('Delete', function() {
        it('should delete pointOfInterest', function() {
            var pointOfInterest = new PointOfInterest();
            var pointOfInterestSpy = simple.mock(pointOfInterest.ps, 'delete', function() {});

            pointOfInterest.delete();
            pointOfInterestSpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear pointOfInterest', function() {
            var pointOfInterest = new PointOfInterest();
            pointOfInterest.description('blah');

            pointOfInterest.description().should.equal('blah');
            pointOfInterest.clear();
            Should.not.exist(pointOfInterest.description());
        });
    });

    describe('Import', function() {
        it('should import pointOfInterest', function() {
            var pointOfInterest = new PointOfInterest();

            Should.not.exist(pointOfInterest.description());
            pointOfInterest.importValues({"description": 'blah'});
            pointOfInterest.description().should.equal('blah');
        });
    });

    describe('Export', function() {
        it('should export pointOfInterest', function() {
            var pointOfInterest = new PointOfInterest();
            pointOfInterest.description('blah');

            pointOfInterest.description().should.equal('blah');
            var exported = pointOfInterest.exportValues();
            exported.description.should.equal('blah');
        });
    });
});

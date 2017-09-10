import simple from 'simple-mock'

import { Tracked } from 'charactersheet/models/common/tracked'

describe('Tracked Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Save', function() {
        it('should save the values.', function() {
            var tracked = new Tracked();
            var saveSpy = simple.mock(tracked.ps, 'save');

            saveSpy.called.should.equal(false);
            tracked.save();
            saveSpy.called.should.equal(true);
        });
    });

    describe('Delete', function() {
        it('should save the values.', function() {
            var tracked = new Tracked();
            var deleteSpy = simple.mock(tracked.ps, 'delete');

            deleteSpy.called.should.equal(false);
            tracked.delete();
            deleteSpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear the values.', function() {
            var tracked = new Tracked();
            tracked.maxUses(3);
            tracked.maxUses().should.equal(3);
            tracked.clear();
            tracked.maxUses().should.equal(0);
        });
    });

    describe('Import', function() {
        it('should import the values.', function() {
            var tracked = new Tracked();
            var values = {
                maxUses: 3
            };
            tracked.maxUses().should.equal(0);
            tracked.importValues(values);
            tracked.maxUses().should.equal(values.maxUses);
        });
    });

    describe('Export', function() {
        it('should export the values.', function() {
            var tracked = new Tracked();
            tracked.maxUses(4);
            tracked.maxUses().should.equal(4);
            var values = tracked.exportValues();
            tracked.maxUses().should.equal(values.maxUses);
        });
    });
});

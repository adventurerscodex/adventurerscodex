'use strict';

describe('Character Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Save', function() {
        it('should save the values.', function() {
            var ft = new Character();
            var saved = false;
            ft.ps.save = function() { saved = true; };

            saved.should.equal(false);
            ft.save();
            saved.should.equal(true);
        });
    });

    describe('Export', function() {
        it('should export the values.', function() {
            var ft = new Character();
            ft.isDefault(true);
            ft.isDefault().should.equal(true);
            var e = ft.exportValues();
            ft.isDefault().should.equal(e.isDefault);
        });
    });

    describe('Delete', function() {
        it('should delete the objects.', function() {
            var ft = new Character();
            var deleted = false;
            ft.ps.delete = function() { deleted = true; };

            deleted.should.equal(false);
            ft.delete();
            deleted.should.equal(true);
        });
    });
});

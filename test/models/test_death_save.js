'use strict';

describe('Death Save Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Save', function() {
        it('should save the values.', function() {
            var ft = new DeathSave();
            var saved = false;
            ft.ps.save = function() { saved = true; };

            saved.should.equal(false);
            ft.save();
            saved.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear the values.', function() {
            var ft = new DeathSave();
            ft.deathSaveSuccess(true);
            ft.deathSaveSuccess().should.equal(true);
            ft.clear();
            ft.deathSaveSuccess().should.equal(false);
        });
    });

    describe('Import', function() {
        it('should import the values.', function() {
            var ft = new DeathSave();
            var e = {
                deathSaveSuccess: true
            };
            ft.deathSaveSuccess().should.equal(false);
            ft.importValues(e);
            ft.deathSaveSuccess().should.equal(e.deathSaveSuccess);
        });
    });

    describe('Export', function() {
        it('should export the values.', function() {
            var ft = new DeathSave();
            ft.deathSaveSuccess(true);
            ft.deathSaveSuccess().should.equal(true);
            var e = ft.exportValues();
            ft.deathSaveSuccess().should.equal(e.deathSaveSuccess);
        });
    });

    describe('Delete', function() {
        it('should delete the objects.', function() {
            var ft = new DeathSave();
            var deleted = false;
            ft.ps.delete = function() { deleted = true; };

            deleted.should.equal(false);
            ft.delete();
            deleted.should.equal(true);
        });
    });
});

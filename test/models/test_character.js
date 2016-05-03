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

    describe('Change Id For Data', function() {
        it('should change the value of the character id or key property in a given json model.', function() {
            var newId = '987654321';
            WeaponFixture.characterId.should.not.equal(newId);
            var newWeapon = Character._changeIdForData(newId, WeaponFixture);
            newWeapon.characterId.should.equal(newId);

            CharacterFixture.key.should.not.equal(newId);
            var newChar = Character._changeIdForData(newId, CharacterFixture);
            newChar.key.should.equal(newId);
        });
    });
});

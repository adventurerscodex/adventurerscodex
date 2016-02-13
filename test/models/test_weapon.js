"use strict";

describe('Weapon Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Instance Methods', function() {
        describe('Clear', function() {
            it('should clear all the data', function() {
                var weap = new Weapon();
                weap.weaponName(WeaponFixture.weaponName);
                weap.weaponName().should.equal(WeaponFixture.weaponName);
                weap.clear();
                weap.weaponName().should.equal('');
            });
        });

        describe('Import', function() {
            it('should import an object with all the info supplied.', function() {
                var weap = new Weapon();
                weap.importValues(WeaponFixture);
                weap.weaponName().should.equal(WeaponFixture.weaponName);
                weap.characterId().should.equal(WeaponFixture.characterId);
            });
        });

        describe('Export', function() {
            it('should yield an object with all the info supplied.', function() {
                var weap = new Weapon();
                weap.importValues(WeaponFixture);
                var values = weap.exportValues();

                weap.characterId().should.equal(values.characterId);
                weap.weaponName().should.equal(values.weaponName);
            });
        });

        describe('Save', function() {
            it('should call the token save.', function() {
                var weap = new Weapon();
                var spy = simple.mock(weap.ps, 'save');
                weap.save();
                spy.called.should.equal(true);
            });
        });

        describe('Delete', function() {
            it('should call the token delete.', function() {
                var weap = new Weapon();
                var spy = simple.mock(weap.ps, 'delete');
                weap.delete();
                spy.called.should.equal(true);
            });
        });
    });
    describe('Find By', function() {
        it('Should return a list of image models matching the given id.', function() {
            //Empty
            simple.mock(PersistenceService, 'findBy').returnWith([new Weapon()]);
            Weapon.findAllBy('someid').length.should.equal(0);

            //Filled
			simple.mock(PersistenceService, 'findAll').returnWith([new Weapon(), new Weapon()].map(function(e, i, _) {
				e.characterId('someid');
				return e;
			}));
            Weapon.findAllBy('someid').length.should.equal(2);

        });
    });
});

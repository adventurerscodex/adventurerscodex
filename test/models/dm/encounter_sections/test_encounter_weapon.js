import { EncounterWeapon } from 'charactersheet/models';
import simple from 'simple-mock';

describe('EncounterWeapon', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('nameLabel', function() {
        it('should return a name if it exists', function() {
            var encounterWeapon = new EncounterWeapon();
            encounterWeapon.weaponName('Sword');

            var label = encounterWeapon.nameLabel();
            label.should.equal('Sword');
        });
    });

    describe('propertyLabel', function() {
        it('should return a property', function() {
            var encounterWeapon = new EncounterWeapon();
            encounterWeapon.weaponDmg('1D4');

            var label = encounterWeapon.propertyLabel();
            label.should.equal('1D4');
        });
        it('should return a blank', function() {
            var encounterWeapon = new EncounterWeapon();

            var label = encounterWeapon.propertyLabel();
            label.should.equal('');
        });
    });

    describe('descriptionLabel', function() {
        it('should return a description', function() {
            var encounterWeapon = new EncounterWeapon();
            encounterWeapon.weaponDescription('Blah');

            var label = encounterWeapon.descriptionLabel();
            label.should.equal('Blah\n');
        });
        it('should return a blank', function() {
            var encounterWeapon = new EncounterWeapon();

            var label = encounterWeapon.descriptionLabel();
            label.should.equal('');
        });
    });
});

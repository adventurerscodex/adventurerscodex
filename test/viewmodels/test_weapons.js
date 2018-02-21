import { CharacterManager } from 'charactersheet/utilities';
import { MockCharacterManager } from '../mocks';
import Should from 'should';
import { Weapon } from 'charactersheet/models';
import { WeaponsViewModel } from 'charactersheet/viewmodels/character/weapons';
import simple from 'simple-mock';

describe('WeaponsViewModel', function(){

    describe('Add Weapon', function() {
        it('should add a weapon to weapons', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var weapons = new WeaponsViewModel();
            weapons.clear();
            weapons.weapons().length.should.equal(0);
            weapons.addWeapon(new Weapon());
            weapons.weapons().length.should.equal(1);
        });
    });

    describe('Edit Weapon', function() {
        it('should select a weapon for editing.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var weapons = new WeaponsViewModel();

            var weapon = new Weapon();
            weapon.weaponName('Sword');
            weapons.editWeapon(weapon);
            weapons.currentEditItem().weaponName().should.equal(weapon.weaponName());
            weapons.modalOpen().should.equal(true);
        });
    });

    describe('Remove Weapon', function() {
        it('should remove a weapon from the WeaponsViewModel', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var weapons = new WeaponsViewModel();
            weapons.clear();
            weapons.weapons().length.should.equal(0);
            weapons.addWeapon();
            weapons.weapons().length.should.equal(1);
            weapons.removeWeapon(weapons.weapons().pop());
            weapons.weapons().length.should.equal(0);
        });
    });

    describe('Clear', function() {
        it('should clear all the values in the WeaponsViewModel', function() {
            var weapons = new WeaponsViewModel();
            var weapon = [new Weapon()];
            weapons.weapons(weapon);
            weapons.weapons().should.equal(weapon);
            weapons.clear();
            weapons.weapons().length.should.equal(0);
        });
    });

    describe('Sort By', function() {
        it('should sort the list of weapons by given criteria', function() {
            var weapons = new WeaponsViewModel();
            weapons.sortBy('weaponName');
            weapons.sort().should.equal(weapons.sorts['weaponName desc']);
            weapons.sortBy('weaponDmg');
            weapons.sort().should.equal(weapons.sorts['weaponDmg asc']);
            weapons.sortBy('weaponRange');
            weapons.sort().should.equal(weapons.sorts['weaponRange asc']);
            weapons.sortBy('weaponDamageType');
            weapons.sort().should.equal(weapons.sorts['weaponDamageType asc']);
            weapons.sortBy('weaponProperty');
            weapons.sort().should.equal(weapons.sorts['weaponProperty asc']);
        });
    });

    describe('Sort Arrow', function() {
        it('should sort the list of weapons by given criteria', function() {
            var weapons = new WeaponsViewModel();
            weapons.sortBy('weaponName');
            weapons.sort().should.equal(weapons.sorts['weaponName desc']);
            weapons.sortArrow('weaponName').should.equal('fa fa-arrow-down fa-color');
            weapons.sortBy('weaponDmg');
            weapons.sort().should.equal(weapons.sorts['weaponDmg asc']);
            weapons.sortArrow('weaponDmg').should.equal('fa fa-arrow-up fa-color');
            weapons.sortArrow('weaponName').should.equal('');
            weapons.sortBy('weaponRange');
            weapons.sort().should.equal(weapons.sorts['weaponRange asc']);
            weapons.sortArrow('weaponRange').should.equal('fa fa-arrow-up fa-color');
            weapons.sortArrow('weaponDmg').should.equal('');
            weapons.sortBy('weaponDamageType');
            weapons.sort().should.equal(weapons.sorts['weaponDamageType asc']);
            weapons.sortArrow('weaponRange').should.equal('');
            weapons.sortArrow('weaponDamageType').should.equal('fa fa-arrow-up fa-color');
            weapons.sortBy('weaponProperty');
            weapons.sort().should.equal(weapons.sorts['weaponProperty asc']);
            weapons.sortArrow('weaponDamageType').should.equal('');
            weapons.sortArrow('weaponProperty').should.equal('fa fa-arrow-up fa-color');
        });
    });

    describe('Total Item Weight', function() {
        it('should return a string with the total weight of all items.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var items = [new Weapon(), new Weapon()].map(function(e, i, _) {
                e.weaponWeight(5);
                return e;
            });

            var weapons = new WeaponsViewModel();
            weapons.totalWeight().should.equal('0 (lbs)');

            weapons = new WeaponsViewModel();
            weapons.weapons(items);
            weapons.weapons().length.should.equal(2);
            weapons.totalWeight().should.equal('10 (lbs)');
        });
    });

    describe('Select Preview Tab', function() {
        it('should switch to preview tab status', function() {
            var weapons = new WeaponsViewModel();
            weapons.selectPreviewTab();
            weapons.previewTabStatus().should.equal('active');
            weapons.editTabStatus().should.equal('');
        });
    });

    describe('Select Edit Tab', function() {
        it('should switch to edit tab status', function() {
            var weapons = new WeaponsViewModel();
            weapons.selectEditTab();
            weapons.editTabStatus().should.equal('active');
            weapons.previewTabStatus().should.equal('');
        });
    });

    describe('Modal Finished Closing', function() {
        it('should switch default state to preview', function() {
            var weapons = new WeaponsViewModel();
            weapons.selectEditTab();
            weapons.modalFinishedClosing();
            weapons.previewTabStatus().should.equal('active');
        });
    });

    describe('Should set autocomplete fields', function() {
        it('should set the value of weapon type when an autocomplete is selected', function() {
            var weapons = new WeaponsViewModel();
            weapons.blankWeapon().weaponName('Sword');
            weapons.setWeaponType('label', 'Melee');

            weapons.blankWeapon().weaponType().should.equal('Melee');
        });
        it('should set the value of weapon handedness when an autocomplete is selected', function() {
            var weapons = new WeaponsViewModel();
            weapons.blankWeapon().weaponName('Sword');
            weapons.setWeaponHandedness('label', 'One-Handed');

            weapons.blankWeapon().weaponHandedness().should.equal('One-Handed');
        });
        it('should set the value of weapon proficiency when an autocomplete is selected', function() {
            var weapons = new WeaponsViewModel();
            weapons.blankWeapon().weaponName('Sword');
            weapons.setWeaponProficiency('label', 'Simple');

            weapons.blankWeapon().weaponProficiency().should.equal('Simple');
        });
        it('should set the value of weapon currency denomination when an autocomplete is selected', function() {
            var weapons = new WeaponsViewModel();
            weapons.blankWeapon().weaponName('Sword');
            weapons.setWeaponCurrencyDenomination('label', 'GP');

            weapons.blankWeapon().weaponCurrencyDenomination().should.equal('GP');
        });
        it('should set the value of weapon damage type when an autocomplete is selected', function() {
            var weapons = new WeaponsViewModel();
            weapons.blankWeapon().weaponName('Sword');
            weapons.setWeaponDamageType('label', 'Acid');

            weapons.blankWeapon().weaponDamageType().should.equal('Acid');
        });
        it('should set the value of weapon property when an autocomplete is selected', function() {
            var weapons = new WeaponsViewModel();
            weapons.blankWeapon().weaponName('Sword');
            weapons.setWeaponProperty('label', 'Finesse');

            weapons.blankWeapon().weaponProperty().should.equal('Finesse');
        });
    });

});

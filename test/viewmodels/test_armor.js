'use strict';

describe('ArmorViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Add Armor', function() {
        it('should add an armor to armors', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var armors = new ArmorViewModel();
            armors.clear();
            armors.armors().length.should.equal(0);
            armors.addArmor(new Armor());
            armors.armors().length.should.equal(1);
        });
    });

    describe('Edit Armor', function() {
        it('should select an armor for editing.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var armors = new ArmorViewModel();
            armors.armors().length.should.equal(0);
            armors.addArmor();
            armors.armors().length.should.equal(1);
            var armor = armors.armors.pop();
            armors.editArmor(armor);
            armors.selecteditem().should.equal(armor);
        });
    });

    describe('Remove Armor', function() {
        it('should remove an armor from the armorsViewModel', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var armors = new ArmorViewModel();
            armors.clear();
            armors.armors().length.should.equal(0);
            armors.addArmor();
            armors.armors().length.should.equal(1);
            armors.removeArmor(armors.armors().pop());
            armors.armors().length.should.equal(0);
        });
    });

    describe('Clear', function() {
        it('should clear all the values in the armorsViewModel', function() {
            var armors = new ArmorViewModel();
            var armor = [new Armor()];
            armors.armors(armor);
            armors.armors().should.equal(armor);
            armors.clear();
            armors.armors().length.should.equal(0);
        });
    });

    describe('Sort By', function() {
        it('should sort the list of armors by given criteria', function() {
            var armors = new ArmorViewModel();
            armors.sortBy('armorName');
            armors.sort().should.equal(armors.sorts['armorName desc']);
            armors.sortBy('armorType');
            armors.sort().should.equal(armors.sorts['armorType asc']);
            armors.sortBy('armorDexBonus');
            armors.sort().should.equal(armors.sorts['armorDexBonus asc']);
            armors.sortBy('armorCheckPenalty');
            armors.sort().should.equal(armors.sorts['armorCheckPenalty asc']);
            armors.sortBy('armorProficiency');
            armors.sort().should.equal(armors.sorts['armorProficiency asc']);
        });
    });

    describe('Sort Arrow', function() {
        it('should sort the list of armors by given criteria', function() {
            var armors = new ArmorViewModel();
            armors.sortBy('armorName');
            armors.sort().should.equal(armors.sorts['armorName desc']);
            armors.sortArrow('armorName').should.equal('fa fa-arrow-down fa-color');
            armors.sortBy('armorType');
            armors.sort().should.equal(armors.sorts['armorType asc']);
            armors.sortArrow('armorType').should.equal('fa fa-arrow-up fa-color');
            armors.sortArrow('armorName').should.equal('');
            armors.sortBy('armorDexBonus');
            armors.sort().should.equal(armors.sorts['armorDexBonus asc']);
            armors.sortArrow('armorDexBonus').should.equal('fa fa-arrow-up fa-color');
            armors.sortArrow('armorType').should.equal('');
            armors.sortBy('armorCheckPenalty');
            armors.sort().should.equal(armors.sorts['armorCheckPenalty asc']);
            armors.sortArrow('armorDexBonus').should.equal('');
            armors.sortArrow('armorCheckPenalty').should.equal('fa fa-arrow-up fa-color');
            armors.sortBy('armorProficiency');
            armors.sort().should.equal(armors.sorts['armorProficiency asc']);
            armors.sortArrow('armorCheckPenalty').should.equal('');
            armors.sortArrow('armorProficiency').should.equal('fa fa-arrow-up fa-color');
        });
    });

    describe('Load', function() {
        it('should load values from db', function() {
            simple.mock(Armor, 'findAllBy').returnWith([new Armor(), new Armor()]);
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var armors = new ArmorViewModel();
            armors.armors().length.should.equal(0);
            armors.load();
            armors.armors().length.should.equal(2);
        });
    });

    describe('Unload', function() {
        it('should unload the data to the items db.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var armors = [new Armor(), new Armor()].map(function(e, i, _) {
                e._spy = simple.mock(e, 'save');
                return e;
            });

            var armors = new ArmorViewModel();
            armors.armors(armors);
            armors.unload();
            armors.armors().length.should.equal(2);

            armors.armors().forEach(function(e, i, _) {
                e._spy.called.should.equal(true);
            });
        });
    });
});

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
            armors.sortBy('armorEquipped');
            armors.sort().should.equal(armors.sorts['armorEquipped asc']);
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
            armors.sortBy('armorEquipped');
            armors.sort().should.equal(armors.sorts['armorEquipped asc']);
            armors.sortArrow('armorEquipped').should.equal('fa fa-arrow-up fa-color');
            armors.sortArrow('armorName').should.equal('');
            armors.sortArrow('armorType').should.equal('');
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

            var armorsVM = new ArmorViewModel();
            armorsVM.armors(armors);
            armorsVM.unload();
            armorsVM.armors().length.should.equal(2);

            armorsVM.armors().forEach(function(e, i, _) {
                e._spy.called.should.equal(true);
            });
        });
    });

    describe('Value Has changed', function() {
        it('should know when the value chagnes.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var armors = [new Armor(), new Armor()].map(function(e, i, _) {
                e._spy = simple.mock(e, 'updateValues');
                return e;
            });

            var armorsVM = new ArmorViewModel();
            armorsVM.armors(armors);
            armorsVM.valueHasChanged();
            armorsVM.armors().length.should.equal(2);

            armorsVM.armors().forEach(function(e, i, _) {
                e._spy.called.should.equal(true);
            });
        });
    });

    describe('Init', function() {
        it('should init the module', function() {
            var armorsVM = new ArmorViewModel();
            armorsVM.init();
        });
    });

    describe('Total Item Weight', function() {
        it('should return a string with the total weight of all items.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var items = [new Armor(), new Armor()].map(function(e, i, _) {
                e.armorWeight(5);
                return e;
            });

            var armorsVM = new ArmorViewModel();
            armorsVM.totalWeight().should.equal('0 (lbs)');

            armorsVM = new ArmorViewModel();
            armorsVM.armors(items);
            armorsVM.armors().length.should.equal(2);
            armorsVM.totalWeight().should.equal('10 (lbs)');
        });
    });

    describe('Select Preview Tab', function() {
        it('should switch to preview tab status', function() {
            var armorsVM = new ArmorViewModel();
            armorsVM.selectPreviewTab();
            armorsVM.previewTabStatus().should.equal('active');
            armorsVM.editTabStatus().should.equal('');
        });
    });

    describe('Select Edit Tab', function() {
        it('should switch to edit tab status', function() {
            var armorsVM = new ArmorViewModel();
            armorsVM.selectEditTab();
            armorsVM.editTabStatus().should.equal('active');
            armorsVM.previewTabStatus().should.equal('');
        });
    });

    describe('Modal Finished Closing', function() {
        it('should switch default state to preview', function() {
            var armorsVM = new ArmorViewModel();
            armorsVM.selectEditTab();
            armorsVM.modalFinishedClosing();
            armorsVM.previewTabStatus().should.equal('active');
        });
    });
});

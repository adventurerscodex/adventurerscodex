'use strict';

describe('TreasureSectionViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Load', function() {
        it('should not load model and section', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new TreasureSectionViewModel(new Encounter());
            var spy1 = simple.mock(Notifications.global.save, 'add');
            var spy2 = simple.mock(Notifications.encounters.changed, 'add');
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);
            simple.mock(PersistenceService, 'findBy').returnWith([new EncounterArmor()]);
            
            vm.load();

            spy1.called.should.equal(true);
            spy2.called.should.equal(true);
        });
        it('should load model and section', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new TreasureSectionViewModel(new Encounter());
            var spy1 = simple.mock(Notifications.global.save, 'add');
            var spy2 = simple.mock(Notifications.encounters.changed, 'add');
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new TreasureSection());
            simple.mock(PersistenceService, 'findBy').returnWith([new EncounterArmor()]);
            
            vm.load();

            spy1.called.should.equal(true);
            spy2.called.should.equal(true);
        });        
    });  

    describe('Unload', function() {
        it('should unsubscribe from notifications', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            var spy1 = simple.mock(Notifications.global.save, 'remove');
            var spy2 = simple.mock(Notifications.encounters.changed, 'remove');
            
            vm.unload();

            spy1.called.should.equal(true);
            spy2.called.should.equal(true);
        });
    });

    describe('Save', function() {
        it('should save model', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new TreasureSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new TreasureSection());
            vm.blankTreasure(new EncounterArmor());
            vm.addTreasure();
            vm.save();
        });
        it('should create and save a new model', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new TreasureSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);
            
            vm.save();
        });        
    });    

    describe('Delete', function() {
        it('should delete model', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new TreasureSection());
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            vm.blankTreasure(new EncounterArmor());
            vm.addTreasure();
            vm.delete();
        });
        it('should do nothing since it can\'t find the model', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);
            
            vm.delete();
        });        
    });    

    describe('setTreasure', function() {
        it('should allocate the correct model', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.itemType('armor');
            
            vm.setTreasure();

            vm.armorShow().should.equal(true);
            vm.armorFirstElementFocus().should.equal(true);
        });
        it('should allocate the correct model', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.itemType('coins');
            
            vm.setTreasure();

            vm.coinsShow().should.equal(true);
            vm.coinsFirstElementFocus().should.equal(true);
        });
        it('should allocate the correct model', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.itemType('item');
            
            vm.setTreasure();

            vm.itemShow().should.equal(true);
            vm.itemFirstElementFocus().should.equal(true);
        });
        it('should allocate the correct model', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.itemType('magicItem');
            
            vm.setTreasure();

            vm.magicItemShow().should.equal(true);
            vm.magicItemFirstElementFocus().should.equal(true);
        });
        it('should allocate the correct model', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.itemType('weapon');
            
            vm.setTreasure();

            vm.weaponShow().should.equal(true);
            vm.weaponFirstElementFocus().should.equal(true);
        }); 
        it('should allocate the correct model', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.itemType('');
            
            vm.setTreasure();
        });                                         
    });    

    /* UI Methods */

    describe('Sort By', function() {
        it('should sort the list of treasure by given criteria', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.sortBy('nameLabel');
            vm.sort().should.equal(vm.sorts['nameLabel desc']);
            vm.sortBy('nameLabel');
            vm.sort().should.equal(vm.sorts['nameLabel asc']);
        });
    });

    describe('Sort Arrow', function() {
        it('should sort the list of treasure by given criteria', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.sortBy('nameLabel');
            vm.sort().should.equal(vm.sorts['nameLabel desc']);
            vm.sortArrow('nameLabel').should.equal('fa fa-arrow-down fa-color');
            vm.sortBy('nameLabel');
            vm.sort().should.equal(vm.sorts['nameLabel asc']);
            vm.sortArrow('nameLabel').should.equal('fa fa-arrow-up fa-color');
        });
    });       

    describe('modalFinishedOpening', function() {
        it('perform actions after a modal has opened', function() {
            var vm = new TreasureSectionViewModel(new Encounter());

            vm.modalFinishedOpening();
        });
    });    

    describe('modalFinishedClosing', function() {
        it('perform actions after a modal has closed', function() {
            var vm = new TreasureSectionViewModel(new Encounter());

            vm.previewTabStatus('');
            vm.editTabStatus('active');
            vm.modalFinishedClosing();
            vm.previewTabStatus().should.equal('active');
            vm.editTabStatus().should.equal('');
        });
    });

    describe('selectPreviewTab', function() {
        it('perform actions after the preview tab has been selected', function() {
            var vm = new TreasureSectionViewModel(new Encounter());

            vm.previewTabStatus('');
            vm.editTabStatus('active');
            vm.selectPreviewTab();
            vm.previewTabStatus().should.equal('active');
            vm.editTabStatus().should.equal('');
        });
    });       

    describe('selectEditTab', function() {
        it('perform actions after the preview tab has been selected', function() {
            var vm = new TreasureSectionViewModel(new Encounter());

            vm.previewTabStatus('active');
            vm.editTabStatus('');
            vm.selectEditTab();
            vm.previewTabStatus().should.equal('');
            vm.editTabStatus().should.equal('active');
        });
    });   

    describe('Data has changed', function() {
        it('should load new data', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new TreasureSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);
            simple.mock(PersistenceService, 'findBy').returnWith([new EncounterArmor()]);
            
            vm._dataHasChanged();
        });
        it('should load new data', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new TreasureSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new TreasureSection());
            simple.mock(PersistenceService, 'findBy').returnWith([new EncounterArmor()]);
            
            vm._dataHasChanged();
        });        
    });     

    describe('Toggle modal', function() {
        it('should toggle modal and add AS to Treasure', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new TreasureSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);
            
            vm.openModal().should.equal(false);
            vm.toggleModal();
            vm.openModal().should.equal(true);
        });
    });   

    describe('addModalFinishedClosing', function() {
        it('should toggle modal and add AS to Treasure', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.shouldShowDisclaimer(true);
            vm.blankTreasure(new EncounterArmor());
            vm.addModalFinishedClosing();
            vm.shouldShowDisclaimer().should.equal(false);
            Should.not.exist(vm.blankTreasure());
        });
    });         

    /* CRUD */

    describe('Add Treasure', function() {
        it('should add new Treasure to array', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.blankTreasure(new EncounterArmor());

            vm.treasure().length.should.equal(0);
            vm.addTreasure();
            vm.treasure().length.should.equal(1);
        });
    });   

    describe('Remove Treasure', function() {
        it('should remove Treasure from array', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.blankTreasure(new EncounterArmor());
            vm.addTreasure();
            vm.treasure().length.should.equal(1);

            vm.removeTreasure(vm.treasure().pop());

            vm.treasure().length.should.equal(0);
        });
    });  

    describe('Edit Treasure', function() {
        it('should put a Treasure from the list of treasure into the selected slot', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var vm = new TreasureSectionViewModel(new Encounter());
            vm.blankTreasure(new EncounterArmor());
            vm.addTreasure();
            Should.not.exist(vm.selecteditem());
            vm.treasure().length.should.equal(1);
            vm.editTreasure(vm.treasure()[0]);
            vm.selecteditem().should.equal(vm.treasure.pop());
        });
    });                                            
});

'use strict';

describe('MonsterSectionViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Load', function() {
        it('should load model and section', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new MonsterSectionViewModel(new Encounter());
            var spy1 = simple.mock(Notifications.global.save, 'add');
            var spy2 = simple.mock(Notifications.encounters.changed, 'add');
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);
            
            vm.load();

            spy1.called.should.equal(true);
            spy2.called.should.equal(true);
        });
    });  

    describe('Unload', function() {
        it('should unsubscribe from notifications', function() {
            var vm = new MonsterSectionViewModel(new Encounter());
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
            var vm = new MonsterSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new MonsterSection());
            
            vm.save();
        });
        it('should create and save a new model', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new MonsterSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);
            
            vm.save();
        });        
    });    

    describe('Delete', function() {
        it('should delete model', function() {
            var vm = new MonsterSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new MonsterSection());
            
            vm.delete();
        });
        it('should do nothing since it can\'t find the model', function() {
            var vm = new MonsterSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);
            
            vm.delete();
        });        
    });    

    /* UI Methods */

    describe('Sort By', function() {
        it('should sort the list of monsters by given criteria', function() {
            var vm = new MonsterSectionViewModel(new Encounter());
            vm.sortBy('name');
            vm.sort().should.equal(vm.sorts['name desc']);
            vm.sortBy('name');
            vm.sort().should.equal(vm.sorts['name asc']);
            vm.sortBy('speed');
            vm.sort().should.equal(vm.sorts['speed asc']);
            vm.sortBy('speed');
            vm.sort().should.equal(vm.sorts['speed desc']);
        });
    });

    describe('Sort Arrow', function() {
        it('should sort the list of monsters by given criteria', function() {
            var vm = new MonsterSectionViewModel(new Encounter());
            vm.sortBy('name');
            vm.sort().should.equal(vm.sorts['name desc']);
            vm.sortArrow('name').should.equal('fa fa-arrow-down fa-color');
            vm.sortArrow('speed').should.equal('');
            vm.sortBy('name');
            vm.sort().should.equal(vm.sorts['name asc']);
            vm.sortArrow('name').should.equal('fa fa-arrow-up fa-color');
            vm.sortArrow('speed').should.equal('');
        });
    });       

    describe('modalFinishedOpening', function() {
        it('perform actions after a modal has opened', function() {
            var vm = new MonsterSectionViewModel(new Encounter());

            vm.shouldShowDisclaimer(false);
            vm.firstElementInModalHasFocus(false);
            vm.modalFinishedOpening();
            vm.shouldShowDisclaimer().should.equal(false);
            vm.firstElementInModalHasFocus().should.equal(true);
        });
    });    

    describe('modalFinishedClosing', function() {
        it('perform actions after a modal has closed', function() {
            var vm = new MonsterSectionViewModel(new Encounter());

            vm.previewTabStatus('');
            vm.editTabStatus('active');
            vm.modalFinishedClosing();
            vm.previewTabStatus().should.equal('active');
            vm.editTabStatus().should.equal('');
        });
    });

    describe('selectPreviewTab', function() {
        it('perform actions after the preview tab has been selected', function() {
            var vm = new MonsterSectionViewModel(new Encounter());

            vm.previewTabStatus('');
            vm.editTabStatus('active');
            vm.selectPreviewTab();
            vm.previewTabStatus().should.equal('active');
            vm.editTabStatus().should.equal('');
        });
    });       

    describe('selectEditTab', function() {
        it('perform actions after the preview tab has been selected', function() {
            var vm = new MonsterSectionViewModel(new Encounter());

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
            var vm = new MonsterSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);
            
            vm._dataHasChanged();
        });
    });     

    describe('Toggle modal', function() {
        it('should toggle modal and add AS to monster', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new MonsterSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);
            
            vm.openModal().should.equal(false);
            vm.toggleModal();
            vm.openModal().should.equal(true);
        });
    });    

    describe('renderAbilityScoresInAddModal', function() {
        it('should show AS', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new MonsterSectionViewModel(new Encounter());
            vm.toggleModal();
            var showAS = vm.renderAbilityScoresInAddModal();
            showAS.should.equal(true);
        });
        it('should not show AS', function() {
            var vm = new MonsterSectionViewModel(new Encounter());
            
            var showAS = vm.renderAbilityScoresInAddModal();
            showAS.should.equal(false);
        });        
    });      

    /* CRUD */

    describe('Add monster', function() {
        it('should add new monster to array', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new MonsterSectionViewModel(new Encounter());
            vm.blankMonster().name('Bob');

            vm.monsters().length.should.equal(0);
            vm.addMonster();
            vm.monsters().length.should.equal(1);
            Should.not.exist(vm.blankMonster().name());
        });
    });   

    describe('Remove monster', function() {
        it('should remove monster from array', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new MonsterSectionViewModel(new Encounter());
            vm.addMonster();
            vm.monsters().length.should.equal(1);

            vm.removeMonster(vm.monsters().pop());

            vm.monsters().length.should.equal(0);
        });
    });  

    describe('Edit monster', function() {
        it('should put a monster from the list of monsters into the selected slot', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var vm = new MonsterSectionViewModel(new Encounter());
            vm.addMonster();
            Should.not.exist(vm.selecteditem());
            vm.monsters().length.should.equal(1);
            vm.editMonster(vm.monsters()[0]);
            vm.selecteditem().should.equal(vm.monsters.pop());
        });
    });                                            
});

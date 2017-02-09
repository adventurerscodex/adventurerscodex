'use strict';

describe('NPCSectionViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Load', function() {
        it('should load model and section', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new NPCSectionViewModel(new Encounter());
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
            var vm = new NPCSectionViewModel(new Encounter());
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
            var vm = new NPCSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new NPCSection());
            vm.addNPC();
            vm.save();
        });
        it('should create and save a new model', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new NPCSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);
            
            vm.save();
        });        
    });    

    describe('Delete', function() {
        it('should delete model', function() {
            var vm = new NPCSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new NPCSection());
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            vm.addNPC();
            vm.delete();
        });
        it('should do nothing since it can\'t find the model', function() {
            var vm = new NPCSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);
            
            vm.delete();
        });        
    });    

    /* UI Methods */

    describe('Sort By', function() {
        it('should sort the list of npcs by given criteria', function() {
            var vm = new NPCSectionViewModel(new Encounter());
            vm.sortBy('name');
            vm.sort().should.equal(vm.sorts['name desc']);
            vm.sortBy('name');
            vm.sort().should.equal(vm.sorts['name asc']);
            vm.sortBy('race');
            vm.sort().should.equal(vm.sorts['race asc']);
            vm.sortBy('race');
            vm.sort().should.equal(vm.sorts['race desc']);
        });
    });

    describe('Sort Arrow', function() {
        it('should sort the list of npcs by given criteria', function() {
            var vm = new NPCSectionViewModel(new Encounter());
            vm.sortBy('name');
            vm.sort().should.equal(vm.sorts['name desc']);
            vm.sortArrow('name').should.equal('fa fa-arrow-down fa-color');
            vm.sortArrow('race').should.equal('');
            vm.sortBy('name');
            vm.sort().should.equal(vm.sorts['name asc']);
            vm.sortArrow('name').should.equal('fa fa-arrow-up fa-color');
            vm.sortArrow('race').should.equal('');
        });
    });       

    describe('modalFinishedOpening', function() {
        it('perform actions after a modal has opened', function() {
            var vm = new NPCSectionViewModel(new Encounter());

            vm.firstElementInModalHasFocus(false);
            vm.modalFinishedOpening();
            vm.firstElementInModalHasFocus().should.equal(true);
        });
    });    

    describe('modalFinishedClosing', function() {
        it('perform actions after a modal has closed', function() {
            var vm = new NPCSectionViewModel(new Encounter());

            vm.previewTabStatus('');
            vm.editTabStatus('active');
            vm.modalFinishedClosing();
            vm.previewTabStatus().should.equal('active');
            vm.editTabStatus().should.equal('');
        });
    });

    describe('selectPreviewTab', function() {
        it('perform actions after the preview tab has been selected', function() {
            var vm = new NPCSectionViewModel(new Encounter());

            vm.previewTabStatus('');
            vm.editTabStatus('active');
            vm.selectPreviewTab();
            vm.previewTabStatus().should.equal('active');
            vm.editTabStatus().should.equal('');
        });
    });       

    describe('selectEditTab', function() {
        it('perform actions after the preview tab has been selected', function() {
            var vm = new NPCSectionViewModel(new Encounter());

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
            var vm = new NPCSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);
            
            vm._dataHasChanged();
        });
    });     

    describe('Toggle modal', function() {
        it('should toggle modal and add AS to NPC', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new NPCSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);
            
            vm.openModal().should.equal(false);
            vm.toggleModal();
            vm.openModal().should.equal(true);
        });
    });    

    /* CRUD */

    describe('Add NPC', function() {
        it('should add new NPC to array', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new NPCSectionViewModel(new Encounter());
            vm.blankNPC().name('Bob');

            vm.npcs().length.should.equal(0);
            vm.addNPC();
            vm.npcs().length.should.equal(1);
            Should.not.exist(vm.blankNPC().name());
        });
    });   

    describe('Remove NPC', function() {
        it('should remove NPC from array', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new NPCSectionViewModel(new Encounter());
            vm.addNPC();
            vm.npcs().length.should.equal(1);

            vm.removeNPC(vm.npcs().pop());

            vm.npcs().length.should.equal(0);
        });
    });  

    describe('Edit NPC', function() {
        it('should put a NPC from the list of npcs into the selected slot', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var vm = new NPCSectionViewModel(new Encounter());
            vm.addNPC();
            vm.npcs().length.should.equal(1);
            vm.editNPC(vm.npcs()[0]);
        });
    });                                            
});

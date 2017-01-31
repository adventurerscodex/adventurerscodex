'use strict';

describe('NotesSectionViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Load', function() {
        it('should load model and section', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new NotesSectionViewModel(new Encounter());
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
            var vm = new NotesSectionViewModel(new Encounter());
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
            var vm = new NotesSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new NotesSection());
            
            vm.save();
        });
        it('should create and save a new model', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new NotesSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);
            
            vm.save();
        });        
    });    

    describe('Delete', function() {
        it('should delete model', function() {
            var vm = new NotesSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new NotesSection());
            
            vm.delete();
        });
    });  

    describe('Data has changed', function() {
        it('should load new data', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new NotesSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);
            
            vm._dataHasChanged();
        });
        it('should load new data', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new NotesSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new NotesSection());
            
            vm._dataHasChanged();
        });        
    });         
});

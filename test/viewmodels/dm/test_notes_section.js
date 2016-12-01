'use strict';

describe('NotesSectionViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Init', function() {
        it('should init view model', function() {
            var vm = new NotesSectionViewModel(new Encounter(), new NotesSection());

            vm.init();
        });
    });

    describe('Load', function() {
        it('should load notes model', function() {
            var notes = new NotesSection();
            notes.notes('blah');
            notes.visible(false);
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new NotesSectionViewModel(new Encounter(), notes);

            vm.load();
        });
        it('should receive a bad input and create a new notesSection', function() {
            var encounter = new Encounter();
            encounter.encounterId('1234');
            var vm = new NotesSectionViewModel(encounter, null);
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            vm.load();
        });
    });

    describe('Unload', function() {
        it('should unload model', function() {
            var vm = new NotesSectionViewModel(new Encounter(), new NotesSection());
            vm.notes('asd');
            vm.visible(false);
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);

            vm.unload();
        });
    });
});

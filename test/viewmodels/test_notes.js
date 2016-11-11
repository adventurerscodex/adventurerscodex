'use strict';

describe('NotesViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Init', function() {
        it('should init the module', function() {
            var notesVM = new NotesViewModel();
            notesVM.init();
        });
    });

    describe('Load', function() {
        it('should load values from db', function() {
            var note = new Note();
            note.text('test');
            simple.mock(PersistenceService, 'findBy').returnWith([note]);
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var notesVM = new NotesViewModel();

            notesVM.load();
            notesVM.notes()[0].text().should.equal('test');
        });

        it('should not load values from database.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            simple.mock(Note, 'findBy').returnWith([]);
            var notesVM = new NotesViewModel();

            notesVM.load();
            notesVM.notes()[0].characterId().should.equal('1234');
        });
    });

    describe('Unload', function() {
        it('should save values to the database', function() {
            var note = new Note();
            var notesVM = new NotesViewModel();
            simple.mock(notesVM, 'notes').returnWith([note]);
            var notifySpy = simple.mock(note, 'save');

            notesVM.unload();

            notifySpy.called.should.equal(true);
        });
    });
});

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
            simple.mock(Note, 'findBy').returnWith([note]);
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var notesVM = new NotesViewModel();
            note.text('test');

            notesVM.load();
            notesVM.note().text().should.equal('test');
        });

        it('should not load values from database', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            simple.mock(CharacterAppearance, 'findBy').returnWith([]);
            var notesVM = new NotesViewModel();

            notesVM.load();
            notesVM.note().characterId().should.equal('1234');
        });
    });

    describe('Unload', function() {
        it('should save values to the database', function() {
            var notesVM = new NotesViewModel();
            var notifySpy = simple.mock(notesVM.note(), 'save');

            notesVM.unload();

            notifySpy.called.should.equal(true);
        });
    });
});

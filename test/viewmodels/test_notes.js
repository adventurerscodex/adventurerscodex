import simple from 'simple-mock'

import { MockCharacterManager } from '../mocks'
import { Note } from 'charactersheet/models/common'
import { CharacterManager, Notifications } from 'charactersheet/utilities'
import { NotesViewModel } from 'charactersheet/viewmodels/common/notes'
import { PersistenceService } from 'charactersheet/services/common'

describe('NotesViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
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
            notesVM.notes()[0].characterId().should.equal('12345');
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

import {
    CharacterManager,
    Notifications
} from 'charactersheet/utilities';
import { MockCharacterManager } from '../mocks';
import { Note } from 'charactersheet/models/common';
import { NotesViewModel } from 'charactersheet/viewmodels/common/notes';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import simple from 'simple-mock';
import should from 'Should';

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
});

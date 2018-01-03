import {
    CharacterManager,
    Notifications
} from 'charactersheet/utilities';
import { MockCharacterManager } from '../mocks';
import { Note } from 'charactersheet/models/common';
import { NotesViewModel } from 'charactersheet/viewmodels/common/notes';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import Should from 'should';
import simple from 'simple-mock';

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
    });

    describe('Get Note To Select', function() {
        it('should get the index of the previous note', function() {
            var note1 = new Note();
            var note2 = new Note();

            var notesVM = new NotesViewModel();
            notesVM.notes.push(note1);
            notesVM.notes.push(note2);

            const index = notesVM.noteToSelect(note2);
            index.should.equal(0);

        });
        it('should get the index after the selected note if it is the first note', function() {
            var note1 = new Note();
            var note2 = new Note();

            var notesVM = new NotesViewModel();
            notesVM.notes.push(note1);
            notesVM.notes.push(note2);

            const index = notesVM.noteToSelect(note1);
            index.should.equal(0);
        });
    });
});

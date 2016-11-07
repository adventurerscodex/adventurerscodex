'use strict';

describe('NotesSectionViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Init', function() {
        it('should init the sub view models', function() {
            var vm = new NotesSectionViewModel(new Encounter(), new NotesSection());

            vm.init();
        });
    });

    describe('Load', function() {
        it('should load the sub view models', function() {
            var notes = new NotesSection();
            notes.notes('blah');
            var vm = new NotesSectionViewModel(new Encounter(), notes);

            vm.load();
        });
        it('should load the sub view models', function() {
            var encounter = new Encounter();
            encounter.encounterId('1234');
            var vm = new NotesSectionViewModel(encounter, null);
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            // simple.mock(parentEncounter, 'encounterId');

            vm.load();
        });
    });

    describe('Unload', function() {
        it('should unload the sub view models', function() {
            var vm = new NotesSectionViewModel();
            var notifySpy = simple.mock(ViewModelUtilities, 'unloadSubViewModels');

            vm.unload();

            notifySpy.called.should.equal(true);
        });
    });
});

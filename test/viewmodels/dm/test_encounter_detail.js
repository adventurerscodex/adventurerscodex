import { CharacterManager } from 'charactersheet/utilities';
import { Encounter } from 'charactersheet/models/dm';
import { EncounterDetailViewModel } from 'charactersheet/viewmodels/dm/encounter_detail';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import should from 'Should';
import simple from 'simple-mock';

describe('EncounterDetailViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Load', function() {
        it('should load encounter\'s data', function() {
            var vm = new EncounterDetailViewModel({
                encounter: new Encounter(),
                sectionModels: []
            });
            var setupSpy = simple.mock(vm, '_dataHasChanged').callFn(function() {});
            setupSpy.called.should.equal(false);

            vm.load();
            setupSpy.called.should.equal(true);
        });
    });

    describe('modalFinishedOpening', function() {
        it('should set the focus of the open modal', function() {
            var vm = new EncounterDetailViewModel(new Encounter(), []);
            vm.modalFinishedOpening();
            vm.nameHasFocus().should.equal(true);
        });
    });

    describe('modalFinishedClosing', function() {
        it('should clear the value of the modal open var and save', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new EncounterDetailViewModel(new Encounter(), []);
            var saveSpy = simple.mock(vm, 'save').callFn(function() {});
            var visibilityVMsSpy = simple.mock(vm, 'visibilityVMs').callFn(function(){return [];});
            var _deinitializeVisibilityVMsSpy = simple.mock(vm, '_deinitializeVisibilityVMs').callFn(function(){});
            simple.mock(Notifications.encounters.changed, 'dispatch').callFn(function(){});
            vm.modalFinishedClosing();
            vm.openModal().should.equal(false);
            saveSpy.called.should.equal(true);
            visibilityVMsSpy.called.should.equal(true);
            _deinitializeVisibilityVMsSpy.called.should.equal(true);
        });
    });

    describe('toggleModal', function() {
        it('should toggle the value of the openModal Var', function() {
            var vm = new EncounterDetailViewModel(new Encounter(), []);
            vm.openModal().should.equal(false);
            vm.toggleModal();
            vm.openModal().should.equal(true);
            vm.toggleModal();
            vm.openModal().should.equal(false);
        });
    });

    // Private Methods

    describe('_initializeSectionVMs', function() {
        it('should create child view models for each section and initialize them.', function() {
            var vm = new EncounterDetailViewModel(new Encounter(), [
                { property: 'notesSectionViewModel', vm: NotesSectionViewModel, model: NotesSection }
            ]);
            simple.mock(PersistenceService, 'findFirstBy').callFn(function(model, attr, value) {
                return new model();
            });

            vm.sections.forEach(function(section, idx, _) {
                Should.not.exist(vm[section.property]());
            });
            vm.sections.forEach(function(section, idx, _) {
                vm._initializeSectionVMs();
                Should.exist(vm[section.property]());
            });

        });
        it('should create child view models for each section and initialize them.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new EncounterDetailViewModel(new Encounter(), []);
            simple.mock(PersistenceService, 'findFirstBy').callFn(function(model, attr, value) {
                return new model();
            });

            vm.sections.push({ property: 'fakeSectionViewModel', vm: function(){}, model: function(){} });
            try {
                vm._initializeSectionVMs();
                (false).should.equal(true);
            } catch(err) {
                (true).should.equal(true);
            }
        });
    });
});

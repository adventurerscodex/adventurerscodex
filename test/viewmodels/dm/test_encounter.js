import { Encounter } from 'charactersheet/models/dm';
import { EncounterCellViewModel } from 'charactersheet/viewmodels/dm/encounter_cell';
import { EncounterDetailViewModel } from 'charactersheet/viewmodels/dm/encounter_detail';
import { EncounterViewModel } from 'charactersheet/viewmodels/dm/encounter';
import should from 'Should';
import simple from 'simple-mock';

describe('Encounter View Model', function() {

    describe('Load', function() {
        it('should load the encounters list', function() {
            var data = [new EncounterCellViewModel(new Encounter())];

            var vm = new EncounterViewModel();
            var spy1 = simple.mock(vm, '_getEncounterCells').returnWith(data);
            var spy2 = simple.mock(vm.selectedCell, 'subscribe').callFn(function() {});

            spy1.called.should.equal(false);
            spy2.called.should.equal(false);
            vm.load();
            spy1.called.should.equal(true);
            spy2.called.should.equal(true);
            vm.selectedCell().encounterId().should.equal(data[0].encounterId());
        });
    });

    describe('Add Encounter', function() {
        it('should take the value from the modal and add relevant data,'
            +' then save and reload the enocunters', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var data = [new EncounterCellViewModel(new Encounter())];

            var vm = new EncounterViewModel();
            vm.encounterDetailViewModel(new EncounterDetailViewModel(new Encounter(), []));
            simple.mock(vm, 'modalEncounter').returnWith(new Encounter());
            var spy1 = simple.mock(vm, '_findCell').returnWith(data[0]);
            var spy3 = simple.mock(vm.encounterDetailViewModel(), 'save').callFn(function() {});

            spy1.called.should.equal(false);
            vm.addEncounter();
            spy1.called.should.equal(true);
            vm.selectedCell().encounterId().should.equal(data[0].encounterId());
            spy3.called.should.equal(true);
        });

//         it('should take the value from the modal and add relevant data,'
//             +' then save and reload the enocunters. This one has a parent', function() {
//             simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
//             var data = [new Encounter()];
//             data[0].parent(uuid.v4());
//
//             var vm = new EncounterViewModel();
//             vm.encounterDetailViewModel(new EncounterDetailViewModel(new Encounter(), []));
//             simple.mock(vm, 'modalEncounter').returnWith(data[0]);
//             var spy1 = simple.mock(vm, '_findCell').returnWith(new EncounterCellViewModel(data[0]));
//             var spy2 = simple.mock(vm.selectedCell, 'subscribe').callFn(function() {});
//             var spy3 = simple.mock(vm.encounterDetailViewModel(), 'save').callFn(function() {});
//
//             spy1.called.should.equal(false);
//             vm.addEncounter();
//             spy1.called.should.equal(true);
//             vm.selectedCell().encounterId().should.equal(data[0].encounterId());
//             spy3.called.should.equal(true);
//         });
    });

    describe('openAddModal', function() {
        it('should add a new encounter to the modal', function() {
            var vm = new EncounterViewModel();

            var modalEncounterSpy = simple.mock(vm, 'modalEncounter').callFn(function() {});
            simple.mock(vm, '_initializeVisibilityViewModel').callFn(function() {});

            modalEncounterSpy.called.should.equal(false);
            vm.openAddModal();
            modalEncounterSpy.called.should.equal(true);
        });
    });

    describe('openAddModalWithParent', function() {
        it('should add a new encounter (with it\'s parent being the given encounter) to the modal', function() {
            var vm = new EncounterViewModel();

            var modalEncounterSpy = simple.mock(vm, 'modalEncounter');
            simple.mock(vm, '_setupSectionVMs').callFn(function() {});

            modalEncounterSpy.called.should.equal(false);
            var parent = new Encounter();
            vm.openAddModalWithParent(parent);
            modalEncounterSpy.called.should.equal(true);

            vm.modalEncounter().parent().should.equal(parent.encounterId());
        });
    });

    describe('modalFinishedOpening', function() {
        it('should set the focus of the open modal', function() {
            var vm = new EncounterViewModel();

            var nameHasFocusSpy = simple.mock(vm, 'nameHasFocus');

            nameHasFocusSpy.called.should.equal(false);
            vm.modalFinishedOpening();
            nameHasFocusSpy.called.should.equal(true);

            vm.nameHasFocus().should.equal(true);
        });
    });

    describe('modalFinishedClosing', function() {
        it('should clear the value of the modal encounter', function() {
            var vm = new EncounterViewModel();
            vm.modalFinishedClosing();
            Should.not.exist(vm.modalEncounter());
        });
    });

    // Private Methods

    describe('_initializeDetailViewModel', function() {
        it('should init and load the encounter detail vm', function() {
            var vm = new EncounterViewModel();
            vm.encounterDetailViewModel(new EncounterDetailViewModel(new Encounter()));

            var loadSpy = simple.mock(vm.encounterDetailViewModel(), 'load').callFn(function() {});

            loadSpy.called.should.equal(false);
            vm._initializeDetailViewModel();
            loadSpy.called.should.equal(true);
        });
    });

    describe('_deinitializeDetailViewModel', function() {
        it('should unload the encounter detail vm', function() {
            var vm = new EncounterViewModel();
            vm.encounterDetailViewModel(new EncounterDetailViewModel(new Encounter()));

            var unloadSpy = simple.mock(vm.encounterDetailViewModel(), 'unload').callFn(function() {});

            unloadSpy.called.should.equal(false);
            vm._deinitializeDetailViewModel();
            unloadSpy.called.should.equal(true);
        });
    });
});

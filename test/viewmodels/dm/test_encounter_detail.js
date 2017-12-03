import { CharacterManager } from 'charactersheet/utilities';
import { Encounter } from 'charactersheet/models/dm';
import { EncounterDetailViewModel } from 'charactersheet/viewmodels/dm/encounter_detail';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import should from 'Should';
import simple from 'simple-mock';
import ko from 'knockout';

describe('EncounterDetailViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Load', function() {
        it('should load encounter\'s data', function() {
            var vm = new EncounterDetailViewModel({
                encounter: ko.observable(new Encounter()),
                sectionModels: []
            });
            var setupSpy = simple.mock(vm, '_dataHasChanged').callFn(function() {});
            setupSpy.called.should.equal(false);

            vm.load();
            setupSpy.called.should.equal(true);
        });
    });

    describe('toggleModal', function() {
        it('should toggle the value of the openModal Var', function() {
            var vm = new EncounterDetailViewModel({
                encounter: ko.observable(new Encounter()),
                sectionModels: []
            });
            vm.openModal().should.equal(false);
            vm.toggleModal();
            vm.openModal().should.equal(true);
            vm.toggleModal();
            vm.openModal().should.equal(false);
        });
    });
});

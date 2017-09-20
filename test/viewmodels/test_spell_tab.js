import simple from 'simple-mock'

import { SpellsTabViewModel } from 'charactersheet/viewmodels/character/spells_tab'
import { ViewModelUtilities } from 'charactersheet/utilities'

describe('SpellsTabViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Load', function() {
        it('should load the sub view models', function() {
            var vm = new SpellsTabViewModel();
            simple.mock(ViewModelUtilities, 'loadSubViewModels').returnWith(true);
            var notifySpy = simple.mock(ViewModelUtilities, 'loadSubViewModels');


            vm.load();

            notifySpy.called.should.equal(true);
        });
    });

    describe('Unload', function() {
        it('should unload the sub view models', function() {
            var vm = new SpellsTabViewModel();
            var notifySpy = simple.mock(ViewModelUtilities, 'unloadSubViewModels');

            vm.unload();

            notifySpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear the sub view models', function() {
            var vm = new SpellsTabViewModel();
            simple.mock(ViewModelUtilities, 'clearSubViewModels').returnWith(true);
            var notifySpy = simple.mock(ViewModelUtilities, 'clearSubViewModels');

            vm.clear();

            notifySpy.called.should.equal(true);
        });
    });

});

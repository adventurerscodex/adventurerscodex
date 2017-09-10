import simple from 'simple-mock'

import { AppearanceViewModel } from 'charactersheet/viewmodels/character/appearance'
import { FeaturesTraitsViewModel } from 'charactersheet/viewmodels/character/features'
import { ProfileTabViewModel } from 'charactersheet/viewmodels/character/profile_tab'
import { ViewModelUtilities } from 'charactersheet/utilities'

describe('ProfileTabViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Load', function() {
        it('should load the sub view models', function() {
            var vm = new ProfileTabViewModel();
            simple.mock(ViewModelUtilities, 'loadSubViewModels').returnWith(true);
            var notifySpy = simple.mock(ViewModelUtilities, 'loadSubViewModels');


            vm.load();

            notifySpy.called.should.equal(true);
        });
    });

    describe('Unload', function() {
        it('should unload the sub view models', function() {
            var vm = new ProfileTabViewModel();
            var notifySpy = simple.mock(ViewModelUtilities, 'unloadSubViewModels');

            vm.unload();

            notifySpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear the sub view models', function() {
            var vm = new ProfileTabViewModel();
            simple.mock(ViewModelUtilities, 'clearSubViewModels').returnWith(true);
            var notifySpy = simple.mock(ViewModelUtilities, 'clearSubViewModels');

            vm.clear();

            notifySpy.called.should.equal(true);
        });
    });

});

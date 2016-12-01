'use strict';

describe('StatsTabViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Init', function() {
        it('should init the sub view models', function() {
            var vm = new StatsTabViewModel();
            var notifySpy = simple.mock(ViewModelUtilities, 'initSubViewModels');

            vm.init();

            notifySpy.called.should.equal(true);
        });
    });

    describe('Load', function() {
        it('should load the sub view models', function() {
            var vm = new StatsTabViewModel();
            simple.mock(ViewModelUtilities, 'loadSubViewModels').returnWith(true);
            var notifySpy = simple.mock(ViewModelUtilities, 'loadSubViewModels');


            vm.load();

            notifySpy.called.should.equal(true);
        });
    });

    describe('Unload', function() {
        it('should unload the sub view models', function() {
            var vm = new StatsTabViewModel();
            var notifySpy = simple.mock(ViewModelUtilities, 'unloadSubViewModels').returnWith({});

            vm.unload();

            notifySpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear the sub view models', function() {
            var vm = new StatsTabViewModel();
            simple.mock(ViewModelUtilities, 'clearSubViewModels').returnWith(true);
            var notifySpy = simple.mock(ViewModelUtilities, 'clearSubViewModels');

            vm.clear();

            notifySpy.called.should.equal(true);
        });
    });

});

'use strict';

describe('Actions Toolbar View Model', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Short Rest Button', function() {
        it('should send a notification to dispatch the reset and one to alert the user.', function() {
            var vm = new ActionsToolbarViewModel();

            var spy1 = simple.mock(Notifications.events.shortRest, 'dispatch');
            var spy2 = simple.mock(Notifications.userNotification.infoNotification, 'dispatch');

            vm.shortRestButton();

            spy1.called.should.equal(true);
            spy2.called.should.equal(true);
        });
    });

    describe('Long Rest Button', function() {
        it('should send a notification to dispatch the reset and one to alert the user.', function() {
            var vm = new ActionsToolbarViewModel();

            var spy1 = simple.mock(Notifications.events.longRest, 'dispatch');
            var spy2 = simple.mock(Notifications.userNotification.infoNotification, 'dispatch');

            vm.longRestButton();

            spy1.called.should.equal(true);
            spy2.called.should.equal(true);
        });
    });

    describe('Arrow Icon Class', function() {
        it('should return the class for the arrow icon on the actions menu', function() {
            var vm = new ActionsToolbarViewModel();

            vm.wellOpen().should.equal(false);
            vm.arrowIconClass().should.equal('fa fa-caret-down');

            vm.wellOpen(true);
            vm.arrowIconClass().should.equal('fa fa-caret-up');
        });
    });

    describe('Toggle Well Open', function() {
        it('should return the class for the arrow icon on the actions menu', function() {
            var vm = new ActionsToolbarViewModel();

            vm.wellOpen().should.equal(false);
            vm.toggleWellOpen();
            vm.wellOpen().should.equal(true);
        });
    });
});

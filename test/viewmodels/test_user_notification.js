'use strict';

describe('UserNotificationViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });
    describe('Add Info Notification', function() {
        it('should add an info notification to the list of notifications', function() {
            var userNotificationViewModel = new UserNotificationViewModel();
            userNotificationViewModel.addInfoNotification('testing', 'title');
            userNotificationViewModel.notifications().length.should.equal(1);
            userNotificationViewModel.notifications()[0].message().should.equal('testing');
            userNotificationViewModel.notifications()[0].type().should.equal('info');
        });
    });

    describe('Add Success Notification', function() {
        it('should add an success notification to the list of notifications', function() {
            var userNotificationViewModel = new UserNotificationViewModel();
            userNotificationViewModel.addSuccessNotification('testing', 'title');
            userNotificationViewModel.notifications().length.should.equal(1);
            userNotificationViewModel.notifications()[0].message().should.equal('testing');
            userNotificationViewModel.notifications()[0].type().should.equal('success');
        });
    });

    describe('Add Warning Notification', function() {
        it('should add an warning notification to the list of notifications', function() {
            var userNotificationViewModel = new UserNotificationViewModel();
            userNotificationViewModel.addWarningNotification('testing', 'title');
            userNotificationViewModel.notifications().length.should.equal(1);
            userNotificationViewModel.notifications()[0].message().should.equal('testing');
            userNotificationViewModel.notifications()[0].type().should.equal('warning');
        });
    });

    describe('Add Danger Notification', function() {
        it('should add an danger notification to the list of notifications', function() {
            var userNotificationViewModel = new UserNotificationViewModel();
            var toastrSpy = simple.mock(toastr, 'error');

            userNotificationViewModel.addDangerNotification('testing', 'title');

            toastrSpy.called.should.equal(true);
        });
    });
});

'use strict';

describe('UserNotificationViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });
    describe('Add Info Notification', function() {
        it('should add an info notification to the list of notifications', function() {
            var userNotificationViewModel = new UserNotificationViewModel();
            userNotificationViewModel.notifications().length.should.equal(0);
            userNotificationViewModel.addInfoNotification('testing');
            userNotificationViewModel.notifications().length.should.equal(1);
            userNotificationViewModel.notifications()[0].message().should.equal('testing');
            userNotificationViewModel.notifications()[0].type().should.equal('info');
        });
    });

    describe('Add Success Notification', function() {
        it('should add an success notification to the list of notifications', function() {
            var userNotificationViewModel = new UserNotificationViewModel();
            userNotificationViewModel.notifications().length.should.equal(0);
            userNotificationViewModel.addSuccessNotification('testing');
            userNotificationViewModel.notifications().length.should.equal(1);
            userNotificationViewModel.notifications()[0].message().should.equal('testing');
            userNotificationViewModel.notifications()[0].type().should.equal('success');
        });
    });

    describe('Add Warning Notification', function() {
        it('should add an warning notification to the list of notifications', function() {
            var userNotificationViewModel = new UserNotificationViewModel();
            userNotificationViewModel.notifications().length.should.equal(0);
            userNotificationViewModel.addWarningNotification('testing');
            userNotificationViewModel.notifications().length.should.equal(1);
            userNotificationViewModel.notifications()[0].message().should.equal('testing');
            userNotificationViewModel.notifications()[0].type().should.equal('warning');
        });
    });

    describe('Add Danger Notification', function() {
        it('should add an danger notification to the list of notifications', function() {
            var userNotificationViewModel = new UserNotificationViewModel();
            userNotificationViewModel.notifications().length.should.equal(0);
            userNotificationViewModel.addDangerNotification('testing');
            userNotificationViewModel.notifications().length.should.equal(1);
            userNotificationViewModel.notifications()[0].message().should.equal('testing');
            userNotificationViewModel.notifications()[0].type().should.equal('danger');
        });
    });

    describe('Visible Notifications', function() {
        it('should only display notifications which have not been marked as read.', function() {
            var userNotificationViewModel = new UserNotificationViewModel();
            userNotificationViewModel.notifications().length.should.equal(0);
            userNotificationViewModel.addDangerNotification('testing');
            userNotificationViewModel.notifications().length.should.equal(1);
            userNotificationViewModel.visibleNotifications().should.not.be.empty();
            userNotificationViewModel.notifications()[0].toggleVisible();
            Should.not.exist(userNotificationViewModel.visibleNotifications());
        });
    });
});

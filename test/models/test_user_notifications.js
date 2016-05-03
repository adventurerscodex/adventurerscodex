'use strict';

describe('User Notifications Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('notificationWithTypeAndMessage', function() {
        it('should return a notification with a given type and message.', function() {
            var type = 'warning';
            var message = 'hi';
            var notification = UserNotification.notificationWithTypeAndMessage(type, message);

            notification.type.should.equal(type);
            notification.message.should.equal(message);
        });
    });

    describe('Alert Class', function() {
        it('should return the correct alert class for a given alert type', function() {
            var type = 'warning';
            var message = 'hi';
            var notification = UserNotification.notificationWithTypeAndMessage(type, message);

            notification.alertClass().should.equal('alert-warning');
        });
    });

    describe('Toggle Visible', function() {
        it('should toggle the visibility of the notification', function() {
            var notification = new UserNotification();
            notification.visible().should.equal(true);

            notification.toggleVisible();
            notification.visible().should.equal(false);

            notification.toggleVisible();
            notification.visible().should.equal(true);
        });
    });
});

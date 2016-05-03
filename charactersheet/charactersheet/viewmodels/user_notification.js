'use strict';

/**
 * This view model is responsible for responding to and displaying
 * user related notifications.
 */
function UserNotificationViewModel() {
    var self = this;

    self.notifications = ko.observableArray([]);

    self.init = function() {
        Notifications.userNotification.infoNotification.add(self.addInfoNotification);
        Notifications.userNotification.successNotification.add(self.addSuccessNotification);
        Notifications.userNotification.warningNotification.add(self.addWarningNotification);
        Notifications.userNotification.dangerNotification.add(self.addDangerNotification);
    };

    self.load = function() {};

    self.unload = function() {};

    self.visibleNotifications = ko.pureComputed(function() {
        return self.notifications().reverse().filter(function(e, i, _) {
            return e.visible();
        })[0];
    });

    self.addInfoNotification = function(message) {
        self.notifications.push(
            UserNotification.notificationWithTypeAndMessage('info', message));
    };

    self.addSuccessNotification = function(message) {
        self.notifications.push(
            UserNotification.notificationWithTypeAndMessage('success', message));
    };

    self.addWarningNotification = function(message) {
        self.notifications.push(
            UserNotification.notificationWithTypeAndMessage('warning', message));
    };

    self.addDangerNotification = function(message) {
        self.notifications.push(
            UserNotification.notificationWithTypeAndMessage('danger', message));
    };

}

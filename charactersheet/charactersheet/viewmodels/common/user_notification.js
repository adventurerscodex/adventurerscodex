'use strict';

/**
 * This view model is responsible for responding to and displaying
 * user related notifications.
 */
function UserNotificationViewModel() {
    var self = this;

    self.load = function() {
        Notifications.userNotification.infoNotification.add(self.addInfoNotification);
        Notifications.userNotification.successNotification.add(self.addSuccessNotification);
        Notifications.userNotification.warningNotification.add(self.addWarningNotification);
        Notifications.userNotification.dangerNotification.add(self.addDangerNotification);

        toastr.options = {
            'closeButton': true,
            'debug': false,
            'newestOnTop': true,
            'progressBar': true,
            'positionClass': 'toast-top-right',
            'preventDuplicates': false,
            'onclick': null,
            'showDuration': '300',
            'hideDuration': '1000',
            'timeOut': '10000',
            'extendedTimeOut': '10000',
            'showEasing': 'swing',
            'hideEasing': 'linear',
            'showMethod': 'fadeIn',
            'hideMethod': 'fadeOut'
        };
    };

    self.unload = function() {
        Notifications.userNotification.infoNotification.remove(self.addInfoNotification);
        Notifications.userNotification.successNotification.remove(self.addSuccessNotification);
        Notifications.userNotification.warningNotification.remove(self.addWarningNotification);
        Notifications.userNotification.dangerNotification.remove(self.addDangerNotification);
    };


    /**
     * Dispatches notification to toastr.
     *
     * @param message  body of notification
     * @param title  title of notification, can be blank.
     */
    self.addInfoNotification = function(message, title) {
        toastr.info(message, title);
    };

    self.addSuccessNotification = function(message, title) {
        toastr.success(message, title);
    };

    self.addWarningNotification = function(message, title) {
        toastr.warning(message, title);
    };

    self.addDangerNotification = function(message, title) {
        toastr.error(message, title);
    };
}

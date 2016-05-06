'use strict';

function UserNotification() {
    var self = this;

    self.characterId = ko.observable(null);
    self.type = ko.observable('');
    self.message = ko.observable('');
    self.visible = ko.observable(true);

    self.alertClass = ko.pureComputed(function() {
        return 'alert-' + self.type();
    });

    self.toggleVisible = function() {
        self.visible(!self.visible());
    };
}

UserNotification.notificationWithTypeAndMessage = function(type, message) {
    var notification = new UserNotification();
    notification.type(type);
    notification.message(message);
    return notification;
};

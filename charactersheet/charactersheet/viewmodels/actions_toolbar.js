'use strict';

function ActionsToolbarViewModel() {
    var self = this;

    self.wellOpen = ko.observable(false)

    self.init = function() {};

    self.load = function() {
    };

    self.unload = function() {
    };

    /* Button Handlers */

    self.shortRestButton = function() {
        Notifications.events.shortRest.dispatch();
        Notifications.userNotification.infoNotification.dispatch("Short Rest Complete");
    };

    self.longRestButton = function() {
        Notifications.events.longRest.dispatch();
        Notifications.userNotification.infoNotification.dispatch("Long Rest Complete");
    };

    self.arrowIconClass = ko.pureComputed(function() {
        return self.wellOpen() ? 'fa fa-caret-up' : 'fa fa-caret-down';
    });

    self.toggleWellOpen = function() {
        self.wellOpen(!self.wellOpen());
    };
}

'use strict';

function ActionsToolbarViewModel() {
    var self = this;

    self.wellOpen = ko.observable(false);

    self.init = function() {
        Notifications.actionsToolbar.toggle.add(self.toggleWellOpen);
    };

    self.load = function() {
    };

    self.unload = function() {
    };

    /* Button Handlers */

    self.shortRestButton = function() {
        Notifications.events.shortRest.dispatch();
        Notifications.userNotification.infoNotification.dispatch(Fixtures.resting.shortRestMessage);
    };

    self.longRestButton = function() {
        Notifications.events.longRest.dispatch();
        Notifications.userNotification.infoNotification.dispatch(Fixtures.resting.longRestMessage);
    };

    self.arrowIconClass = ko.pureComputed(function() {
        return self.wellOpen() ? 'fa fa-caret-up' : 'fa fa-caret-down';
    });

    self.toggleWellOpen = function() {
        self.wellOpen(!self.wellOpen());
    };
}

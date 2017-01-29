'use strict';

function ActionsToolbarViewModel() {
    var self = this;

    self.wellOpen = ko.observable(false);

    self.load = function() {
        Notifications.actionsToolbar.toggle.add(self.toggleWellOpen);
    };

    self.unload = function() {
        Notifications.actionsToolbar.toggle.remove(self.toggleWellOpen);        
    };

    /* Button Handlers */

    self.shortRestButton = function() {
        Notifications.events.shortRest.dispatch();
        Notifications.userNotification.infoNotification.dispatch(Fixtures.resting.shortRestMessage, 'Short Rest');
    };

    self.longRestButton = function() {
        Notifications.events.longRest.dispatch();
        Notifications.userNotification.infoNotification.dispatch(Fixtures.resting.longRestMessage, 'Long Rest');
    };

    self.arrowIconClass = ko.pureComputed(function() {
        return self.wellOpen() ? 'fa fa-caret-up' : 'fa fa-caret-down';
    });

    self.toggleWellOpen = function() {
        self.wellOpen(!self.wellOpen());
    };
}

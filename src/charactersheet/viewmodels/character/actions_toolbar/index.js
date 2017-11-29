import 'bin/knockout-custom-loader';
import {
    Fixtures,
    Notifications
} from 'charactersheet/utilities';
import campingTent from 'images/camping-tent.svg';
import ko from 'knockout';
import meditation from 'images/meditation.svg';
import template from './index.html';

export function ActionsToolbarViewModel(params) {
    var self = this;

    self.wellOpen = params.wellState;
    self.meditation = meditation;
    self.campingTent = campingTent;

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

ko.components.register('actions-toolbar', {
    viewModel: ActionsToolbarViewModel,
    template: template
});

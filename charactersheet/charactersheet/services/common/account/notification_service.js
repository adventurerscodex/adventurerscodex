import ko from 'knockout';

import { SharedServiceManager } from '../shared_service_manager';
import { Notifications,
    Utility } from 'charactersheet/utilities';

/**
 * A global service that fetches the user's active notifications.
 */
export var NotificationsServiceManager = new SharedServiceManager(_NotificationsService, null);

/**
 * An internal service implementation that holds onto data regarding the
 * account notifications.
 *
 * This service contains all of the relevant information for keeping
 * track of a user's authentication state.
 */
function _NotificationsService(config) {
    var self = this;

    self.url = '/api/notifications.json';

    self.notifications = ko.observableArray([]);

    /**
     * A configuration object that can be used to set options at initialization-time.
     * Changes to this object after such time requires a rebuild of the service.
     */
    self.config = config;

    self.init = function() {
        Notifications.authentication.loggedIn.add(self.getNotifications);
    };

    self.getNotifications = function() {
        Utility.oauth.getJSON(self.url, self._handleResponse);
    };

    self.markAsRead = function(status) {
        Utility.oauth.putData(status.url, { read: true });
    };

    // Private Methods

    self._handleResponse = function(data, status) {
        if (status !== 'success') {
            return;
        }

        self.notifications(data.results);
        self.notifications().forEach(function(status) {
            var options = {
                onCloseClick: function() {
                    self.markAsRead(status);
                },
                onclick: function() {
                    self.markAsRead(status);
                }
            };
            if (status.notification.requires_confirmation) {
                options['timeOut'] = 0;
                options['extendedTimeOut'] = 0;
            }

            var notificationType = status.notification.type + 'Notification';
            Notifications.userNotification[notificationType].dispatch(
                status.notification.content,
                status.notification.title,
                options
            );
        });
    };
}

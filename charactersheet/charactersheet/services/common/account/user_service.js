import {
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { SharedServiceManager } from '../shared_service_manager';
import ko from 'knockout';
/**
 * A global service that fetches the user's account information.
 */
export var UserServiceManager = new SharedServiceManager(_UserService, null);

/**
 * An internal service implementation that holds onto data regarding the
 * account login status, tokens and expiration.
 *
 * This service contains all of the relevant information for keeping
 * track of a user's authentication state.
 */
function _UserService(config) {
    var self = this;

    self.url = '/api/users.json';

    self.user = ko.observable(null);

    /**
     * A configuration object that can be used to set options at initialization-time.
     * Changes to this object after such time requires a rebuild of the service.
     */
    self.config = config;

    self.init = function() {
        Notifications.authentication.loggedIn.add(self.getAccount);
    };

    self.getAccount = function() {
        Utility.oauth.getJSON(self.url, self._handleResponse);
    };

    // Private Methods

    self._handleResponse = function(data, status) {
        if (status !== 'success') {
            return;
        }

        var user = data.results[0];
        if (user) {
            self.user(user);
            Notifications.user.exists.dispatch();
        }
    };
}

'use strict';

/**
 * A global service that observes changes in account statuses
 * and holds onto the global account state per session.
 */
var AuthenticationServiceManager = new SharedServiceManager(_AuthenticationService, null);

/**
 * An internal service implementation that holds onto data regarding the
 * account login status, tokens and expiration.
 *
 * This service contains all of the relevant information for keeping
 * track of a user's authentication state.
 */
function _AuthenticationService(config) {
    var self = this;

    self.validationUrl = '/api/o/validate/';

    /**
     * A configuration object that can be used to set options at initialization-time.
     * Changes to this object after such time requires a rebuild of the service.
     */
    self.config = config;

    self._tokenOrigin = null;

    self.TOKEN_ORIGINS = {
        FRAGMENT: 'fragment',
        LOCAL: 'local'
    };

    self.init = function() {
        // Make sure the token we have is valid.
        var fragments = (new URI()).fragment(true);
        var token = PersistenceService.findAll(AuthenticationToken)[0];

        var accessToken = null;
        if (fragments['access_token']) {
            accessToken = fragments['access_token'];
            self._tokenOrigin = self.TOKEN_ORIGINS.FRAGMENT;
        } else if (token && token.isValid()) {
            accessToken = token.accessToken();
            self._tokenOrigin = self.TOKEN_ORIGINS.LOCAL;
        } else {
            return;
        }

        self._doAuthCheck(accessToken);
    };

    // Private Methods

    self._doAuthCheck = function(accessToken) {
        Utility.oauth.getJSON(self.validationUrl, self._handleValidationSuccess,
            self._handleValidationFailure, accessToken);
    };

    self._handleValidationSuccess = function(data, status) {
        var token = PersistenceService.findAll(AuthenticationToken)[0];
        if (self._tokenOrigin == self.TOKEN_ORIGINS.FRAGMENT) {
            if (!token) {
                token = new AuthenticationToken();
            }
            var fragments = (new URI()).fragment(true);
            token.mapTokenKeys(fragments);
            token.startTime((new Date()).getTime());
            token.save();
            Notifications.authentication.loggedIn.dispatch();
        } else if (self._tokenOrigin == self.TOKEN_ORIGINS.LOCAL) {
            Notifications.authentication.loggedIn.dispatch();
        } else {
            return;
        }
    };

    self._handleValidationFailure = function(request, status) {
        var token = PersistenceService.findAll(AuthenticationToken)[0];
        if (self._tokenOrigin == self.TOKEN_ORIGINS.FRAGMENT) {
            // Retry with local token.
            self._tokenOrigin = self.TOKEN_ORIGINS.LOCAL;
            if (token) {
                self._doAuthCheck(token.accessToken());
            }
        } else {
            // All tokens are invalid and should be removed.
            if (token) {
                token.delete();
            }
        }

        // Alert the user of the error.
        var message = request.responseJSON.detail || 'An error has occurred.';
        Notifications.userNotification.warningNotification.dispatch(message, null, {
            timeOut: 0,
            extendedTimeOut: 0
        });
    };
}

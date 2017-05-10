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

    self.init = function() {
        // Make sure the token we have is valid.
        var fragments = (new URI()).fragment(true);
        var token = PersistenceService.findAll(AuthenticationToken)[0];

        var accessToken = null;
        if (fragments['access_token']) {
            accessToken = fragments['access_token'];
        } else if (token && token.isValid()) {
            accessToken = token.accessToken();
        } else {
            return;
        }

        Utility.oauth.getJSON(self.validationUrl, self._handleValidationResponse,
            self._handleValidationResponse, accessToken);
    };

    // Private Methods

    self._handleValidationResponse = function(data, status) {
        var token = PersistenceService.findAll(AuthenticationToken)[0];
        if (status !== 'success' || data.code !== 0) {
            if (token) {
                token.delete();
            }
        } else {
            var fragments = (new URI()).fragment(true);
            if (!token) {
                token = new AuthenticationToken();
            }

            token.mapTokenKeys(fragments);
            token.startTime((new Date()).getTime());
            token.save();

            if (token.isValid()) {
                Notifications.authentication.loggedIn.dispatch();
            }
        }
    };
}
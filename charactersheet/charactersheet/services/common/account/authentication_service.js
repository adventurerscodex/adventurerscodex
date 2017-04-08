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

    self.validationUrl = '/api/o/validate/?access_token={access_token}';

    /**
     * A configuration object that can be used to set options at initialization-time.
     * Changes to this object after such time requires a rebuild of the service.
     */
    self.config = config;

    self.init = function() {
        // Make sure the token we have is valid.
        var fragments = (new URI()).fragment(true);
        var token = PersistenceService.findAll(AuthenticationToken)[0];
        var url = null;

        if (fragments['access_token']) {
            url = self.validationUrl.replace('{access_token}', fragments['access_token']);
        } else if (token && token.isValid()) {
            url = self.validationUrl.replace('{access_token}', token.accessToken());
        } else {
            return;
        }

        $.getJSON(url, self._handleValidationResponse);
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
        }
        Notifications.authentication.loggedIn.dispatch();
    };
}

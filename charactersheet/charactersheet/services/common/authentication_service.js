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

    /**
     * A configuration object that can be used to set options at initialization-time.
     * Changes to this object after such time requires a rebuild of the service.
     */
    self.config = config;

    self.init = function() {
        // Get the fragments from the current URL.
        var fragments = (new URI()).fragment(true);

        var token = PersistenceService.findAll(AuthenticationToken)[0];
        if (!token) {
            token = new AuthenticationToken();
        }
        token.map(fragments);
        token.save();
    };
}

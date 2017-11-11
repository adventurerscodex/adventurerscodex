import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';

/**
 * Persisted Model for an OAuth Token.
 * For more information regarding OAuth tokens see:
 * https://django-oauth-toolkit.readthedocs.io/en/latest/rest-framework/getting_started.html#step-4-get-your-token-and-use-your-api
 */
export function AuthenticationToken() {
    var self = this;
    self.ps = PersistenceService.register(AuthenticationToken, self);
    self.mapping = {
        include: [ 'accessToken', 'expiresIn', 'tokenType', 'scopes', 'startTime' ]
    };

    /**
     * The current user's access token, if it exists.
     */
    self.accessToken = ko.observable();
    /**
     * The total time that was given to the application by the server.
     * For the amount of time remaining, @see timeTillExpires.
     */
    self.expiresIn = ko.observable();
    self.tokenType = ko.observable();
    self.scopes = ko.observable();

    self.startTime = ko.observable((new Date()).getTime());

    /**
     * A method that determines how long until the stored token is invalid.
     * If there is no stored token then the time returned is 0.
     */
    self.timeTillExpires = function() {
        var expiresIn = self.expiresIn();
        var startTime = self.startTime();
        if (!startTime || !expiresIn) { return 0; }

        var currentTime = (new Date()).getTime();
        var elapsedSeconds = (currentTime - startTime) / 1000;

        var timeRemaining = expiresIn - elapsedSeconds;
        return timeRemaining > 0 ? timeRemaining : 0;
    };


    /**
     * Returns whether or not the token is valid.
     */
    self.isValid = function() {
        return self.timeTillExpires() > 0;
    };

    /**
     * Map the given fragment object's properties onto a self.
     */
    self.mapTokenKeys = function(fragments) {
        self.accessToken(fragments['access_token']);
        if (fragments['expires_in']) {
            self.expiresIn(parseInt(fragments['expires_in']));
        }
        self.tokenType(fragments['token_type']);
        if (fragments['scope']) {
            self.scopes(fragments['scope'].split(' '));
        }
    };

    // CRUD Methods

    self.clear = function() {
        var values = new AuthenticationToken().exportValues();
        ko.mapping.fromJS(values, self.mapping, self);
    };

    self.importValues = function(values) {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.exportValues = function() {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        return ko.mapping.toJS(self, mapping);
    };

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };
}


PersistenceService.addToRegistry(AuthenticationToken);

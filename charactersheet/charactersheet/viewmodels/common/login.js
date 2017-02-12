'use strict';

function LoginViewModel() {
    var self = this;

    self._loginLink = '/api/o/authorize?client_id={client_id}&response_type=token';
    self._logoutLink = '/api/accounts/logout/';

    self._dummy = ko.observable();

    self.load = function() {
        Notifications.authentication.loggedIn.add(self.dataHasChanged);
    };

    self.unload = function() {
        Notifications.authentication.loggedIn.remove(self.dataHasChanged);
    };

    /* UI Methods */

    self.loginStatusLabel = ko.pureComputed(function() {
        self._dummy();
        return self._loginStatus() ? 'Logout' : 'Login';
    });

    self.loginLink = ko.pureComputed(function() {
        self._dummy();
        if (self._loginStatus()) {
            return self._logoutLink;
        } else {
            return self._loginLink.replace('{client_id}', Settings.CLIENT_ID);
        }
    });

    /* Public Methods */

    self.logoutLinkWasClicked = function() {
        var token = PersistenceService.findAll(AuthenticationToken)[0];
        if (token) {
            token.delete();
        }
        return true; // Navigate to the link.
    };

    self.dataHasChanged = function() {
        self._dummy.valueHasMutated();
    };

    /* Private Methods */

    self._loginStatus = function() {
        var token = PersistenceService.findAll(AuthenticationToken)[0];
        return token && token.isValid();
    };
}

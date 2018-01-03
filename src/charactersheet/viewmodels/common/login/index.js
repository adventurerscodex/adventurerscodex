import {
    AuthenticationServiceManager,
    PersistenceService,
    UserServiceManager
} from 'charactersheet/services/common';
import {
    Notifications,
    ViewModelUtilities
} from 'charactersheet/utilities';
import { AuthenticationToken } from 'charactersheet/models/common';
import ko from 'knockout';
import template from './index.html';

export function LoginViewModel() {
    var self = this;

    self._loginLink = '/api/o/authorize?client_id={client_id}&response_type=token';
    self.signupLink = '/accounts/register/';
    self._logoutLink = '/accounts/logout/?next=/charactersheet/';
    self._revokeToken = '/api/o/revoke_token/';

    self._dummy = ko.observable();

    self.load = function() {
        Notifications.authentication.loggedIn.add(self.dataHasChanged);
        self.dataHasChanged();
    };

    /* UI Methods */

    self.loginLink = ko.pureComputed(function() {
        self._dummy();
        return self._loginLink.replace('{client_id}', CLIENT_ID);
    });

    self.loggedIn = ko.pureComputed(function() {
        self._dummy();
        var token = PersistenceService.findAll(AuthenticationToken)[0];
        return token && token.isValid();
    });

    self.username = ko.pureComputed(function() {
        self._dummy();
        var user = UserServiceManager.sharedService().user();
        return user ? user.username : null;
    });

    /* Public Methods */

    self.logoutLinkWasClicked = function() {
        var token = PersistenceService.findAll(AuthenticationToken)[0];
        if (token) {
            token.delete();
            $.post(self._revokeToken, {
                token: token.accessToken,
                client_id: CLIENT_ID
            });
        }
        return true; // Navigate to the link.
    };

    self.dataHasChanged = function() {
        self._dummy.valueHasMutated();
    };
}

ko.components.register('login', {
    viewModel: LoginViewModel,
    template: template
});

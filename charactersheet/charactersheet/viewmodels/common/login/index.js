'use strict';

import ko from 'knockout'

import { AuthenticationServiceManager } from 'charactersheet/services/common/account'
import { Notifications } from 'charactersheet/utilities'
import { PersistenceService } from 'charactersheet/services/common'
import { UserServiceManager } from 'charactersheet/services/common/account'
import { ViewModelUtilities } from 'charactersheet/utilities'

export function LoginViewModel() {
    var self = this;

    self._loginLink = '/api/o/authorize?client_id={client_id}&response_type=token';
    self.signupLink = '/accounts/register/';
    self._logoutLink = '/accounts/logout/?next=/charactersheet/';
    self._revokeToken = '/api/o/revoke_token/';

    self._dummy = ko.observable();

    self.load = function() {
        Notifications.authentication.loggedIn.add(self.dataHasChanged);
        UserServiceManager.sharedService().init();
        AuthenticationServiceManager.sharedService().init();
    };

    self.unload = function() {
        Notifications.authentication.loggedIn.remove(self.dataHasChanged);
    };

    /* UI Methods */

    self.loginLink = ko.pureComputed(function() {
        self._dummy();
        return self._loginLink.replace('{client_id}', Settings.CLIENT_ID);
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
                client_id: Settings.CLIENT_ID
            });
        }
        return true; // Navigate to the link.
    };

    self.dataHasChanged = function() {
        self._dummy.valueHasMutated();
    };
}


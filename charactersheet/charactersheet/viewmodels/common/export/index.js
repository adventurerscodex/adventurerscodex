import { UserServiceManager } from 'charactersheet/services/common';
import ko from 'knockout';
import template from './index.html';

export function ExportViewModel(params) {
    var self = this;

    self.selectedCharacter = params.selectedCharacter;
    self.modalStatus = params.modalStatus || ko.observable(false);
    self.isLoggedIn = ko.observable(false);

    self.load = function() {
        self.doesUserExist();
    };

    self.unload = function() {
        self.modalStatus(false);
    };

    self.doesUserExist = function() {
        var userExists = UserServiceManager.sharedService().user() != null;
        self.isLoggedIn(userExists);
    };

    self.closeModal = function() {
        self.modalStatus(false);
    };
}

ko.components.register('export', {
    viewModel: ExportViewModel,
    template: template
});

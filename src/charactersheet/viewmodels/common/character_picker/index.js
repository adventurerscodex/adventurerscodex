import 'bin/knockout-custom-loader';
import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { Core } from 'charactersheet/models/common/core';
import ko from 'knockout';
import logo from 'images/logo-full-circle-icon.png';
import template from './index.html';

export function CorePickerViewModel(params) {
    var self = this;

    self.totalLocalStorage = 5; //MB
    self.logo = logo;
    self.isLoggedIn = ko.observable(false);
    self.cores = ko.observableArray([]);
    self.defaultCoreKey = ko.observable(null);
    self.state = params.state;
    self.deleteCollapse = {
        // Dynamically built map.
    };

    self.load = async () => {
        const response = await Core.ps.list();
        self.cores(response.objects);

        // Build the hash of key -> modal open.
        self.cores().forEach(({uuid}) => {
            self.deleteCollapse[uuid()] = ko.observable(false);
        });
    };

    self.showWizard = () => {
        self.state('wizard');
    };

    self.changeCore = (core) => {
        // Don't switch to the same core.
        var activeCoreKey = null;
        if (CoreManager.activeCore()) {
            activeCoreKey = CoreManager.activeCore().uuid();
        }

        // Do switch
        if (core.uuid() !== activeCoreKey) {
            CoreManager.changeCore(core.uuid());
        }
    };

    self.removeCore = (core) => {
        //Remove the core.
        core.delete();
        self.cores.remove(core);

        self.deleteCollapse[core.uuid()](false);
    };

    self.toggleDeleteWell = ({uuid}) => {
        // Set the others to close.
        self.cores().forEach(({uuid}) => {
            self.deleteCollapse[uuid()](false);
        });

        // Open the one we need.
        const value = !self.deleteCollapse[uuid()]();
        self.deleteCollapse[uuid()](value);
    };

    self.localStoragePercent = ko.computed(() => {
        var n = self.cores().lenth; //Force ko to recompute on change.
        var used = JSON.stringify(localStorage).length / (0.5 * 1024 * 1024);
        return (used / self.totalLocalStorage * 100).toFixed(2);
    });
}

ko.components.register('core-picker', {
    viewModel: CorePickerViewModel,
    template: template
});

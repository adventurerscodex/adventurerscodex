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

    self.logo = logo;
    self.isLoggedIn = ko.observable(false);
    self.cores = ko.observableArray([]);
    self.defaultCoreKey = ko.observable(null);
    self.state = params.state;
    self.deleteCollapse = {
        // Dynamically built map.
    };

    self.load = async () => {
        await self.refresh();
        Notifications.playerimage.changed.add(self.refresh);
    };

    self.refresh = async () => {
        const response = await Core.ps.list();

        // Build the hash of key -> modal open.
        response.objects.forEach(({uuid}) => {
            self.deleteCollapse[uuid()] = ko.observable(false);
        });

        // We set this value after populating the deleteCollapse because by
        // setting this value, we cause KO to render, which if the deleteCollapse
        // was empty, would cause it to crash.
        self.cores(response.objects);
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

    self.removeCore = async (core) => {
        //Remove the core.
        await Core.ps.delete({uuid: core.uuid()});
        self.cores.remove(core);

        self.deleteCollapse[core.uuid()](false);
    };

    self.toggleDeleteWell = ({uuid}) => {
        // Set the others to close.
        self.cores().forEach(({uuid}) => {
            self.deleteCollapse[uuid()](false);
        });

        // Open the one we need.
        self.deleteCollapse[uuid()](true);
    };

    self.closeDeleteWell = ({uuid}) => {
        // Close the one we need.
        self.deleteCollapse[uuid()](false);
    };
}

ko.components.register('core-picker', {
    viewModel: CorePickerViewModel,
    template: template
});

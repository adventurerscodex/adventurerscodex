import autoBind from 'auto-bind';
import 'bin/knockout-custom-loader';
import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import { Core } from 'charactersheet/models/common/core';
import ko from 'knockout';
import logo from 'images/logo-full-circle-icon.png';
import template from './index.html';

export class CorePickerViewModel extends ViewModel {

    logo = logo;
    isLoggedIn = ko.observable(false);
    cores = ko.observableArray([]);
    defaultCoreKey = ko.observable(null);
    deleteCollapse = { /* Dynamically built map */ };

    constructor(params) {
        super(params);
        autoBind(this);
        this.state = params.state;
    }

    // UI State

    hasFavorites = ko.pureComputed(() => this.favorites().length > 0);

    favorites = ko.pureComputed(() => (
        this.cores().filter(core => core.isFavorite())
    ));

    others = ko.pureComputed(() => (
        this.cores().filter(core => !core.isFavorite())
    ));

    // Methods

    async load() {
        await this.refresh();
        Notifications.playerimage.changed.add(this.refresh);
        await super.load();
    }

    async refresh() {
        const response = await Core.ps.list();

        response.objects.forEach(({ uuid }) => {
            this.deleteCollapse[ko.unwrap(uuid)] = ko.observable(false);
        });

        // We set this value after populating the deleteCollapse because by
        // setting this value, we cause KO to render, which if the deleteCollapse
        // was empty, would cause it to crash.
        this.cores(response.objects);
    }

    showWizard() {
        this.state('wizard');
    }

    changeCore(core) {
        // Don't switch to the same core.
        var activeCoreKey = null;
        if (CoreManager.activeCore()) {
            activeCoreKey = CoreManager.activeCore().uuid();
        }

        if (core.uuid() !== activeCoreKey) {
            CoreManager.changeCore(core.uuid());
        }
    }

    async removeCore(core) {
        const uuid = ko.unwrap(core.uuid);
        await Core.ps.delete({ uuid });
        this.cores.remove(core);
        this.deleteCollapse[uuid](false);
    }

    async toggleFavorite(core) {
        core.isFavorite(!core.isFavorite());
        try {
            await core.ps.save();
        } catch(err) {
            console.log(err);
        }
    }

    toggleDeleteWell({ uuid }) {
        this.closeAll();
        this.deleteCollapse[ko.unwrap(uuid)](true);
    }

    closeAll() {
        this.cores().forEach(({ uuid }) => {
            this.deleteCollapse[ko.unwrap(uuid)](false);
        });
    }

    closeDeleteWell({uuid}) {
        this.deleteCollapse[uuid()](false);
    }
}

ko.components.register('core-picker', {
    viewModel: CorePickerViewModel,
    template: template
});

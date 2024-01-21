import autoBind from 'auto-bind';
import './style.css';
import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import { Core } from 'charactersheet/models/common/core';
import ko from 'knockout';
import template from './index.html';

export class CharactersViewModel extends ViewModel {

    cores = ko.observableArray([]);
    modalStatus = ko.observable(false);
    selectedCharacter = ko.observable();
    deleteCollapse = { /* Dynamically built map */ };

    constructor(params) {
        super(params);
        autoBind(this);
        this.componentStatus = params.modalStatus || ko.observable(false);
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
        const response = await Core.ps.list();
        const cores = response.objects;
        this.modalStatus(ko.utils.unwrapObservable(this.componentStatus));

        Notifications.coreManager.changed.add(this._updatedSelectedCharacter);
        this._updatedSelectedCharacter();

        // Build the hash of uuid -> modal open.
        cores.forEach(({uuid}) => {
            this.deleteCollapse[uuid()] = ko.observable(false);
        });
        this.cores(cores);
        super.load();
    }

    changeCore(core) {
        // Don't switch to the same core.
        var activeCharacterKey = null;
        if (CoreManager.activeCore()) {
            activeCharacterKey = CoreManager.activeCore().uuid();
        }

        // Do switch
        if (core.uuid() !== activeCharacterKey) {
            CoreManager.changeCore(core.uuid());
        }
        this.modalStatus(false);
    }

    async toggleFavorite(core) {
        core.isFavorite(!core.isFavorite());
        try {
            await core.ps.save();
        } catch(err) {
            console.log(err);
        }
    }

    async removeCore(core) {
        const deletedCharacterIndex = this.cores().indexOf(core);

        //Remove the core.
        await core.ps.delete();
        this.cores.remove(core);

        // Close the well.
        this.deleteCollapse[core.uuid()](false);

        if (this.cores().length === 0) {
            this.modalStatus(false);
        } else if (core.uuid() === CoreManager.activeCore().uuid()) {
            // If we've deleted the current core...
            // switch to the same index position bounded by list length.
            const index = (
                deletedCharacterIndex < this.cores().length ?
                    deletedCharacterIndex :
                    this.cores().length - 1
            );
            CoreManager.changeCore(this.cores()[index].uuid());
        }
    }

    toggleDeleteWell({ uuid }) {
        this.closeAll();

        const value = !this.deleteCollapse[ko.unwrap(uuid)]();
        this.deleteCollapse[ko.unwrap(uuid)](value);
    }

    closeAll() {
        this.cores().forEach(({ uuid }) => {
            this.deleteCollapse[ko.unwrap(uuid)](false);
        });
    }

    closeDeleteWell({ uuid }) {
        this.deleteCollapse[ko.unwrap(uuid)](false);
    }

    modalFinishedClosing() {
        if (this.cores().length === 0) {
            Notifications.characters.allRemoved.dispatch();
        }
        this.componentStatus(false);
    }

    playerSelectedCSS(core) {
        if (core.uuid() === this.selectedCharacter().uuid()) {
            return 'light-active';
        }
        return '';
    }

    // Private Methods

    _updatedSelectedCharacter() {
        this.selectedCharacter(CoreManager.activeCore());
    }
}

ko.components.register('characters', {
    viewModel: CharactersViewModel,
    template: template
});

import './style.css';
import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { Core } from 'charactersheet/models/common/core';
import ko from 'knockout';
import template from './index.html';

export function CharactersViewModel(params) {
    var self = this;

    self.cores = ko.observableArray([]);
    self.componentStatus = params.modalStatus || ko.observable(false);
    self.modalStatus = ko.observable(false);
    self.selectedCharacter = ko.observable();
    self.deleteCollapse = {
        // Dynamically built map.
    };

    self.load = async () => {
        const response = await Core.ps.list();
        const cores = response.objects;
        self.modalStatus(ko.utils.unwrapObservable(self.componentStatus));

        Notifications.coreManager.changed.add(self._updatedSelectedCharacter);
        self._updatedSelectedCharacter();

        // Build the hash of uuid -> modal open.
        cores.forEach(({uuid}) => {
            self.deleteCollapse[uuid()] = ko.observable(false);
        });
        self.cores(cores);
    };

    self.changeCore = (core) => {
        // Don't switch to the same core.
        var activeCharacterKey = null;
        if (CoreManager.activeCore()) {
            activeCharacterKey = CoreManager.activeCore().uuid();
        }

        // Do switch
        if (core.uuid() !== activeCharacterKey) {
            CoreManager.changeCore(core.uuid());
        }
        self.modalStatus(false);
    };

    self.removeCore = async (core) => {
        const deletedCharacterIndex = self.cores().indexOf(core);

        //Remove the core.
        await core.ps.delete();
        self.cores.remove(core);

        // Close the well.
        self.deleteCollapse[core.uuid()](false);

        if (self.cores().length === 0) {
            self.modalStatus(false);
        } else if (core.uuid() === CoreManager.activeCore().uuid()) {
            // If we've deleted the current core...
            // switch to the same index position bounded by list length.
            const index = (
                deletedCharacterIndex < self.cores().length ?
                deletedCharacterIndex :
                self.cores().length - 1
            );
            CoreManager.changeCore(self.cores()[index].uuid());
        }
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

    self.closeDeleteWell = ({uuid}) => {
        // Close the one we need.
        self.deleteCollapse[uuid()](false);
    };

    self.modalFinishedClosing = () => {
        if (self.cores().length === 0) {
            Notifications.characters.allRemoved.dispatch();
        }
        self.componentStatus(false);
    };

    self.playerSelectedCSS = (core) => {
        if (core.uuid() === self.selectedCharacter().uuid()) {
            return 'light-active';
        }
        return '';
    };

    // Private Methods

    self._updatedSelectedCharacter = () => {
        self.selectedCharacter(CoreManager.activeCore());
    };
}

ko.components.register('characters', {
    viewModel: CharactersViewModel,
    template: template
});

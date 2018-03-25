import './style.css';
import {
    Character,
    PlayerTypes
} from 'charactersheet/models/common';
import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';
import template from './index.html';

export function CharactersViewModel(params) {
    var self = this;

    self.totalLocalStorage = 5; //MB
    self.characters = ko.observableArray([]);
    self.componentStatus = params.modalStatus || ko.observable(false);
    self.modalStatus = ko.observable(false);
    self.selectedCharacter = ko.observable();
    self.deleteCollapse = {
        // Dynamically built map.
    };

    self.load = () => {
        self.characters(PersistenceService.findAll(Character));
        self.modalStatus(self.componentStatus());

        Notifications.coreManager.changed.add(self._updatedSelectedCharacter);
        self._updatedSelectedCharacter();

        // Build the hash of key -> modal open.
        self.characters().forEach(({key}) => {
            self.deleteCollapse[key()] = ko.observable(false);
        });
    };

    self.changeCharacter = (character) => {
        // Don't switch to the same character.
        var activeCharacterKey = null;
        if (CoreManager.activeCore()) {
            activeCharacterKey = CoreManager.activeCore().uuid();
        }

        // Do switch
        if (character.key() !== activeCharacterKey) {
            CoreManager.changeCharacter(character.key());
        }
    };

    self.addCharacter = () => {
        var character = new Character();
        character.key(uuid.v4());
        character.playerType(PlayerTypes.characterPlayerType);

        self.characters.push(character);
        if (!CoreManager.defaultCharacter()) {
            character.isDefault(true);
        }
        character.save();
        Notifications.characters.changed.dispatch();
        window.location = character.url();
    };

    self.removeCharacter = (character) => {
        const deletedCharacterIndex = self.characters().indexOf(character);

        //Remove the character.
        character.delete();
        self.characters.remove(character);

        // Close the well.
        self.deleteCollapse[character.key()](false);

        if (self.characters().length === 0) {
            self.modalStatus(false);
        } else if (character.key() === CoreManager.activeCore().uuid()) {
            // If we've deleted the current character...
            // switch to the same index position bounded by list length.
            const index = (
                deletedCharacterIndex < self.characters().length ?
                deletedCharacterIndex :
                self.characters().length - 1
            );
            CoreManager.changeCharacter(self.characters()[index].key());
        }
    };

    self.toggleDeleteWell = ({key}) => {
        // Set the others to close.
        self.characters().forEach(({key}) => {
            self.deleteCollapse[key()](false);
        });

        // Open the one we need.
        const value = !self.deleteCollapse[key()]();
        self.deleteCollapse[key()](value);
    };

    self.modalFinishedClosing = () => {
        if (self.characters().length === 0) {
            Notifications.characters.allRemoved.dispatch();
        }
        self.componentStatus(false);
    };

    self.playerSelectedCSS = (character) => {
        if (character.key() === self.selectedCharacter().key()) {
            return 'light-active';
        }
        return '';
    };

    self.localStoragePercent = ko.computed(() => {
        self.characters(); //Force ko to recompute on change.
        var used = JSON.stringify(localStorage).length / (0.5 * 1024 * 1024);
        return (used / self.totalLocalStorage * 100).toFixed(2);
    });

    // Private Methods

    self._updatedSelectedCharacter = () => {
        self.selectedCharacter(CoreManager.activeCore());
    };
}

ko.components.register('characters', {
    viewModel: CharactersViewModel,
    template: template
});

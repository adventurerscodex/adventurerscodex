import {
    Character,
    PlayerTypes
} from 'charactersheet/models/common';
import {
    CharacterManager,
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

    self.load = () => {
        self.characters(PersistenceService.findAll(Character));
        self.modalStatus(self.componentStatus());

        Notifications.characterManager.changed.add(self._updatedSelectedCharacter);
        self._updatedSelectedCharacter();
    };

    self.changeCharacter = (character) => {
        // Don't switch to the same character.
        var activeCharacterKey = null;
        if (CharacterManager.activeCharacter()) {
            activeCharacterKey = CharacterManager.activeCharacter().key();
        }

        // Do switch
        if (character.key() !== activeCharacterKey) {
            CharacterManager.changeCharacter(character.key());
        }
    };

    self.addCharacter = () => {
        var character = new Character();
        character.key(uuid.v4());
        character.playerType(PlayerTypes.characterPlayerType);

        self.characters.push(character);
        if (!CharacterManager.defaultCharacter()) {
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

        if (self.characters().length === 0) {
            self.modalStatus(false);
        } else if (character.key() === CharacterManager.activeCharacter().key()) {
            // If we've deleted the current character...
            // switch to the same index position bounded by list length.
            const index = (
                deletedCharacterIndex < self.characters().length ?
                deletedCharacterIndex :
                self.characters().length - 1
            );
            CharacterManager.changeCharacter(self.characters()[index].key());
        }
    };

    self.modalFinishedClosing = () => {
        if (self.characters().length === 0) {
            Notifications.characters.allRemoved.dispatch();
        }
        self.componentStatus(false);
    };

    self.playerSelectedCSS = (character) => {
        if (character.key() === self.selectedCharacter().key()) {
            return 'active';
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
        self.selectedCharacter(CharacterManager.activeCharacter());
    };
}

ko.components.register('characters', {
    viewModel: CharactersViewModel,
    template: template
});

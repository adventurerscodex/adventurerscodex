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

    self.load = function() {
        self.characters(PersistenceService.findAll(Character));
        self.modalStatus(self.componentStatus());
    };

    self.changeCharacter = function(character) {
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

    self.addCharacter = function() {
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

    self.removeCharacter = function(character) {
        //Remove the character.
        character.delete();
        self.characters.remove(character);

        if (self.characters().length === 0) {
            self.modalStatus(false);
        } else {
            // Change to the first character in the list
            CharacterManager.changeCharacter(self.characters()[0].key());
        }
    };

    self.modalFinishedClosing = function() {
        if (self.characters().length === 0) {
            Notifications.characters.allRemoved.dispatch();
        }
        self.componentStatus(false);
    };

    self.localStoragePercent = ko.computed(function() {
        var n = self.characters().lenth; //Force ko to recompute on change.
        var used = JSON.stringify(localStorage).length / (0.5 * 1024 * 1024);
        return (used / self.totalLocalStorage * 100).toFixed(2);
    });
}

ko.components.register('characters', {
    viewModel: CharactersViewModel,
    template: template
});

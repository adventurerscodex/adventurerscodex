import ko from 'knockout'

import { CharacterManager } from 'charactersheet/utilities'
import { Notifications } from 'charactersheet/utilities'
import { PersistenceService } from 'charactersheet/services/common'
import { Character,
    PlayerTypes } from 'charactersheet/models/common'

import template from './index.html'


export function CharactersViewModel(params) {
    var self = this;

    self.totalLocalStorage = 5; //MB
    self.characters = ko.observableArray([]);
    self.modalStatus = params.modalStatus || ko.observable(false);

    self.load = function() {
        self.characters(PersistenceService.findAll(Character));
        self.modalStatus(true);
    };

    self.unload = function() {
        self.modalStatus(false);
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
            Notifications.characters.allRemoved.dispatch();
        } else {
            //Change the active character.
            CharacterManager.changeCharacter(self.characters()[0].key());
        }
    };

    self.localStoragePercent = ko.computed(function() {
        var n = self.characters().lenth; //Force ko to recompute on change.
        var used = JSON.stringify(localStorage).length / (0.5 * 1024 * 1024);
        return (used / self.totalLocalStorage * 100).toFixed(2);
    });

    self.closeModal = function() {
        self.modalStatus(false);
    }
}

ko.components.register('characters', {
  viewModel: CharactersViewModel,
  template: template
})

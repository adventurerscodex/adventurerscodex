import 'bin/knockout-custom-loader';
import {
    CharacterManager,
    Notifications
} from 'charactersheet/utilities';
import { Character } from 'charactersheet/models/common/character';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';
import logo from 'images/logo-full-circle-icon.png';
import template from './index.html';

export function CharacterPickerViewModel(params) {
    var self = this;

    self.totalLocalStorage = 5; //MB
    self.logo = logo;
    self.isLoggedIn = ko.observable(false);
    self.characters = ko.observableArray([]);
    self.defaultCharacterKey = ko.observable(null);
    self.state = params.state;
    self.deleteCollapse = {
        // Dynamically built map.
    };

    self.load = () => {
        self.characters(PersistenceService.findAll(Character));

        // Build the hash of key -> modal open.
        self.characters().forEach(({key}) => {
            self.deleteCollapse[key()] = ko.observable(false);
        });
    };

    self.showWizard = () => {
        self.state('wizard');
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

    self.removeCharacter = (character) => {
        //Remove the character.
        character.delete();
        self.characters.remove(character);

        self.deleteCollapse[character.key()](false);
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

    self.localStoragePercent = ko.computed(() => {
        var n = self.characters().lenth; //Force ko to recompute on change.
        var used = JSON.stringify(localStorage).length / (0.5 * 1024 * 1024);
        return (used / self.totalLocalStorage * 100).toFixed(2);
    });
}

ko.components.register('character-picker', {
    viewModel: CharacterPickerViewModel,
    template: template
});

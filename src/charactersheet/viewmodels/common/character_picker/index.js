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
    self.selectedCharacter = ko.observable();
    self.characters = ko.observableArray([]);
    self.defaultCharacterKey = ko.observable(null);
    self.state = params.state;
    self.deleteCollapse = ko.observable(false);

    self.load = function() {
        self.characters(PersistenceService.findAll(Character));
    };

    self.showWizard = function() {
        self.state('wizard');
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

    self.removeCharacter = function() {
        //Remove the character.
        self.selectedCharacter().delete();
        self.characters.remove(self.selectedCharacter());
        self.closeDelete();
    };

    self.openDelete = (character) => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
        self.selectedCharacter(character);
        self.deleteCollapse(true);
    };

    self.closeDelete = () => {
        self.deleteCollapse(false);
    };

    self.localStoragePercent = ko.computed(function() {
        var n = self.characters().lenth; //Force ko to recompute on change.
        var used = JSON.stringify(localStorage).length / (0.5 * 1024 * 1024);
        return (used / self.totalLocalStorage * 100).toFixed(2);
    });
}

ko.components.register('character-picker', {
    viewModel: CharacterPickerViewModel,
    template: template
});

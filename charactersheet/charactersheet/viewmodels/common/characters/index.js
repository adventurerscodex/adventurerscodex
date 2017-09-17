import ko from 'knockout'

import { CharacterManager } from 'charactersheet/utilities'
import { Notifications } from 'charactersheet/utilities'
import { PersistenceService } from 'charactersheet/services/common'
import {
    Character,
    PlayerTypes
 } from 'charactersheet/models/common'

import template from './index.html'


export function CharactersViewModel() {
    var self = this;

    self.totalLocalStorage = 5; //MB

    self.isLoggedIn = ko.observable(false);

    self.selectedCharacter = ko.observable();

    self.characters = ko.observableArray([]);
    self.defaultCharacterKey = ko.observable(null);

    self.init = function() {
        Notifications.characters.changed.add(function() {
            self.load();
        });
        Notifications.profile.changed.add(function() {
            self.load();
        });
        Notifications.user.exists.add(self._handleUserChanged);
    };

    self.load = function() {
        self.characters(PersistenceService.findAll(Character));
        var defaultKey = '';
        try {
            defaultKey = self.characters().filter(function(e, i, _) {
                return e.isDefault();
            })[0].key();
        } catch(err) { /*Ignore*/ }
        self.defaultCharacterKey(defaultKey);

        //Subscriptions
        self.characters().forEach(function(e, i, _) {
            e.isDefault.subscribe(function() {
                e.save();
            });
        });
        self.defaultCharacterKey.subscribe(function() {
            self.characters().forEach(function(e, i, _) {
                if (self.defaultCharacterKey() === e.key()) {
                    e.isDefault(true);
                } else {
                    e.isDefault(false);
                }
                e.save();
            });
        });
    };

    self.unload = function() {
        self.characters().forEach(function(e, i, _) {
            e.save();
        });
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

    self.selectCharacter = function(character) {
        self.selectedCharacter(CharacterManager.activeCharacter());
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
        Notifications.characters.changed.dispatch();

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

    self._handleUserChanged = function() {
        var userExists = UserServiceManager.sharedService().user() != null;
        self.isLoggedIn(userExists);
    };
}

ko.components.register('characters', {
  viewModel: CharactersViewModel,
  template: template
})

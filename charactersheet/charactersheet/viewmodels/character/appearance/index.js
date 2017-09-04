'use strict';

import ko from 'knockout'

import { CharacterAppearance } from 'charactersheet/models/character'
import { CharacterManager } from 'charactersheet/utilities'
import { Notifications } from 'charactersheet/utilities'
import { PersistenceService } from 'charactersheet/services/common'

import template from './index.html'

export function AppearanceViewModel() {
    var self = this;

    self.appearance = ko.observable(new CharacterAppearance());

    self.load = function() {
        Notifications.global.save.add(self.save);

        var key = CharacterManager.activeCharacter().key();
        var appear = PersistenceService.findBy(CharacterAppearance, 'characterId', key);
        if (appear.length > 0) {
            self.appearance(appear[0]);
        } else {
            self.appearance(new CharacterAppearance());
        }
        self.appearance().characterId(key);
    };

    self.unload = function() {
        self.appearance().save();
        Notifications.global.save.remove(self.save);
    };

    self.save = function() {
        self.appearance().save();
    };

    self.clear = function() {
        self.appearance().clear();
    };
}

ko.components.register('appearance', {
  viewModel: AppearanceViewModel,
  template: template
})

'use strict';

import ko from 'knockout'

import { FeaturesTraits } from 'charactersheet/models/character'
import { CharacterManager } from 'charactersheet/utilities'
import { Notifications } from 'charactersheet/utilities'
import { PersistenceService } from 'charactersheet/services/common'

import template from './index.html'

export function FeaturesTraitsViewModel() {
    var self = this;

    self.featTraits = ko.observable(new FeaturesTraits());

    self.load = function() {
        Notifications.global.save.add(self.save);

        var ft = PersistenceService.findBy(FeaturesTraits, 'characterId',
            CharacterManager.activeCharacter().key());
        if (ft.length > 0) {
            self.featTraits(ft[0]);
        } else {
            self.featTraits(new FeaturesTraits());
        }
        self.featTraits().characterId(CharacterManager.activeCharacter().key());
    };

    self.unload = function() {
        self.featTraits().save();
        Notifications.global.save.remove(self.save);
    };

    self.save = function() {
        self.featTraits().save();
    };
}

ko.components.register('feat-traits', {
  viewModel: FeaturesTraitsViewModel,
  template: template
})

'use strict';

import ko from 'knockout'

import { CharacterManager } from 'charactersheet/utilities'
import { Notifications } from 'charactersheet/utilities'
import { PersistenceService } from 'charactersheet/services/common'
import { SpellStats } from 'charactersheet/models/character'

import template from './index.html'

export function SpellStatsViewModel() {
    var self = this;

    self.spellStats = ko.observable(new SpellStats());
    self.modalStatus = ko.observable(false);
    self.editItem = ko.observable();
    self.firstModalElementHasFocus = ko.observable(false);

    self.load = function() {
        Notifications.global.save.add(self.save);

        var key = CharacterManager.activeCharacter().key();
        var stats = PersistenceService.findBy(SpellStats, 'characterId', key);
        if (stats.length > 0) {
            self.spellStats(stats[0]);
        } else {
            self.spellStats(new SpellStats());
        }
        self.spellStats().characterId(key);
        self.spellStats().spellAttackBonus.subscribe(self.dataHasChanged);
    };

    self.unload = function() {
        self.save();
        Notifications.global.save.remove(self.save);
    };

    self.save = function() {
        self.spellStats().save();
    };

    self.clear = function() {
        self.spellStats().clear();
    };

    self.setSpellCastingAbility = function(label, value) {
        self.editItem().spellcastingAbility(label);
    };

    // Modal Methods

    self.editSpellStats = function() {
        self.modalStatus(true);
        self.editItem(new SpellStats());
        self.editItem().importValues(self.spellStats().exportValues());
    };

    self.modalFinishedAnimating = function() {
        self.firstModalElementHasFocus(true);
        self.firstModalElementHasFocus.valueHasMutated();
    };

    self.modalFinishedClosing = function() {
        if (self.modalStatus()) {
            self.spellStats().importValues(self.editItem().exportValues());
        }
        self.dataHasChanged();
        self.modalStatus(false);
    };

    self.dataHasChanged = function() {
        self.spellStats().save();
        Notifications.spellStats.changed.dispatch();
    };
}

ko.components.register('spell-stats', {
  viewModel: SpellStatsViewModel,
  template: template
})
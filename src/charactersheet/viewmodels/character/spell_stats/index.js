import 'bin/knockout-bootstrap-modal';
import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { SpellStats } from 'charactersheet/models/character';
import ko from 'knockout';
import template from './index.html';

export function SpellStatsViewModel() {
    var self = this;

    self.spellStats = ko.observable(new SpellStats());
    self.modalStatus = ko.observable(false);
    self.editItem = ko.observable();
    self.firstModalElementHasFocus = ko.observable(false);

    self.load = async () => {
        var key = CoreManager.activeCore().uuid();
        var stats = await SpellStats.ps.read({uuid: key});
        self.spellStats(stats.object);
        self.spellStats().spellAttackBonus.subscribe(self.dataHasChanged);
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
        self.editItem().castingAbility(self.spellStats().castingAbility().shortName());
    };

    self.modalFinishedAnimating = function() {
        self.firstModalElementHasFocus(true);
        self.firstModalElementHasFocus.valueHasMutated();
    };

    self.modalFinishedClosing = async () => {
        if (self.modalStatus()) {
            self.spellStats().importValues(self.editItem().exportValues());
            // TODO: Make sure the casting ability is updated too
            var response = await self.editItem().ps.save();
            self.spellStats(response.object);
        }

        self.modalStatus(false);
    };

    self.dataHasChanged = function() {
        Notifications.spellStats.changed.dispatch();
    };
}

ko.components.register('spell-stats', {
    viewModel: SpellStatsViewModel,
    template: template
});
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
    };

    self.clear = function() {
        self.spellStats().clear();
    };

    self.setSpellCastingAbility = function(label, value) {
        self.editItem().castingAbility(label);
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

    self.modalFinishedClosing = async () => {
        if (self.modalStatus()) {
            try {
                var response = await self.editItem().ps.save();
                self.spellStats(response.object);
                self.dataHasChanged();
            } catch(err) {
                // Ignore
            }
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
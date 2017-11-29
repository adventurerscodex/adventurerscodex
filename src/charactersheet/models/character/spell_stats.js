import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { Fixtures } from 'charactersheet/utilities';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';

export function SpellStats() {
    var self = this;
    self.ps = PersistenceService.register(SpellStats, self);
    self.mapping = {
        include: ['characterId', 'spellcastingAbility', 'spellSaveDc',
                  'spellAttackBonus', 'spellsKnown', 'spellsCantripsKnown',
                  'spellsInvocationsKnown', 'spellsMaxPrepared']
    };

    self.characterId = ko.observable(null);
    self.spellcastingAbility = ko.observable('');
    self.spellSaveDc = ko.observable(0);
    self.spellAttackBonus = ko.observable(0);
    self.spellsKnown = ko.observable(0);
    self.spellsCantripsKnown = ko.observable(0);
    self.spellsInvocationsKnown = ko.observable(0);
    self.spellsMaxPrepared = ko.observable(0);

    self.spellcastingAbilityOptions = ko.observableArray(
        Fixtures.spellStats.spellcastingAbilityOptions);

    //Public Methods

    self.clear = function() {
        var values = new SpellStats().exportValues();
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.importValues = function(values) {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.exportValues = function() {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        return ko.mapping.toJS(self, mapping);
    };

    self.save = function() {
        self.ps.save();
    };
}


PersistenceService.addToRegistry(SpellStats);

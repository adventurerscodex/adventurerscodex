'use strict';

import ko from 'knockout'

import { SavingThrows,
    AbilityScores } from 'charactersheet/models'
import { PersistenceService } from 'charactersheet/services/common'

export function SavingThrows() {
    var self = this;
    self.ps = PersistenceService.register(SavingThrows, self);
    self.mapping = {
        include: ['characterId', 'name', 'modifier', 'proficiency']
    };

    self.characterId = ko.observable(null);
    self.name = ko.observable('');
    self.modifier = ko.observable(null);
    self.proficiency = ko.observable(false);

    //UI Methods

    self.proficiencyScore = function() {
        return ProficiencyService.sharedService().proficiency();
    };

    self.abilityScoreModifier = function() {
        var score = null;
        try {
            var key = CharacterManager.activeCharacter().key();
            score = PersistenceService.findBy(AbilityScores, 'characterId', key)[0].modifierFor(self._abilityScore());
        } catch(err) { /*Ignore*/ }
        if (score === null){
            return null;
        }
        else {
            return parseInt(score);
        }
    };

    self.bonus = ko.pureComputed(function() {
        var bonus = self.modifier() ? parseInt(self.modifier()) : null;
        if (self.proficiency()) {
            bonus += self.proficiencyScore() + self.abilityScoreModifier();
        }
        else if (self.abilityScoreModifier()) {
            bonus += self.abilityScoreModifier();
        }
        else {
            bonus = bonus != null ? bonus : null;
        }
        return bonus;
    });

    self.modifierLabel = ko.pureComputed(function() {
        if (self.bonus() === null){
            return '+ 0';
        }
        var str = self.bonus() >= 0 ? '+ ' + self.bonus() : '- ' + Math.abs(self.bonus());
        return str;
    });

    self.proficiencyLabel = ko.pureComputed(function() {
        if (self.proficiency() === true) {
            return 'fa fa-check';
        }
        return '';
    });

    //Utility Methods

    self._abilityScore = function() {
        return self.name().toLowerCase().substring(0,3);
    };

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };

    self.updateValues = function() {
        self.modifier.notifySubscribers();
        self.proficiency.notifySubscribers();
    };

    self.clear = function() {
        var values = new SavingThrows().exportValues();
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
}

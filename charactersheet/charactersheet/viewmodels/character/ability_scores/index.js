import 'bin/knockout-bootstrap-modal';
import {
    AbilityScores,
    getModifier,
    getStrModifier } from 'charactersheet/models/character/ability_scores';
import {
    CharacterManager,
    Notifications
} from 'charactersheet/utilities';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';
import template from './index.html';


export function AbilityScoresViewModel() {
    var self = this;

    self.abilityScores = ko.observable(new AbilityScores());
    self.modalStatus = ko.observable(false);
    self.editItem = ko.observable();
    self.firstModalElementHasFocus = ko.observable(false);

    self.load = function() {
        Notifications.global.save.add(self.save);
        var key = CharacterManager.activeCharacter().key();
        var scores = PersistenceService.findBy(AbilityScores, 'characterId', key);
        if (scores.length > 0) {
            self.abilityScores(scores[0]);
        } else {
            self.abilityScores(new AbilityScores());
        }
        self.abilityScores().characterId(key);

        //Subscriptions
        self.abilityScores().str.subscribe(self.dataHasChanged);
        self.abilityScores().dex.subscribe(self.dexterityHasChanged);
        self.abilityScores().con.subscribe(self.dataHasChanged);
        self.abilityScores().int.subscribe(self.intelligenceHasChanged);
        self.abilityScores().wis.subscribe(self.dataHasChanged);
        self.abilityScores().cha.subscribe(self.dataHasChanged);
    };

    self.unload = function() {
        self.save();
        Notifications.global.save.remove(self.save);
    };

    self.save = function() {
        self.abilityScores().save();
    };

    self.dataHasChanged = function() {
        self.abilityScores().save();
        Notifications.abilityScores.changed.dispatch();
    };

    self.intelligenceHasChanged = function() {
        self.abilityScores().save();
        Notifications.abilityScores.intelligence.changed.dispatch();
        Notifications.abilityScores.changed.dispatch();
    };

    self.dexterityHasChanged = function() {
        self.abilityScores().save();
        Notifications.abilityScores.dexterity.changed.dispatch();
        Notifications.abilityScores.changed.dispatch();
    };

    // Modal Methods

    self.openModal = function() {
        self.editItem(new AbilityScores());
        self.editItem().importValues(self.abilityScores().exportValues());

        self.modalStatus(true);
         // Alert the modal even if the value didn't technically change.
        self.modalStatus.valueHasMutated();
    };

    self.modalFinishedAnimating = function() {
        self.firstModalElementHasFocus(true);
        self.firstModalElementHasFocus.valueHasMutated();
    };

    self.modalFinishedClosing = function() {
        if (self.modalStatus()) {
            self.abilityScores().importValues(self.editItem().exportValues());
        }
        self.modalStatus(false);
        self.abilityScores().save();
    };
}

ko.components.register('ability-scores', {
    viewModel: AbilityScoresViewModel,
    template: template
});

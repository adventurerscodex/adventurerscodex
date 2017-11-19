import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { Status } from 'charactersheet/models';
import ko from 'knockout';

/**
 * Fields from a pCard will be extracted to create the UI representation of a player.
 * @param pCard  contains all the fields that make up a player
 */
export function PlayerCard(pCard) {

    var self = this;

    self.DANGER_THRESHOLD = 0.30;
    self.WARNING_THRESHOLD = 0.50;
    /* Fields that will be used by the UI.
       Add more fields to the array as needed.
       _Note_: The 'key' has to have the same name as the model attribute. */
    var playerCardFields = [
        {'key':'publisherJid', 'converter': null},
        {'key':'name', 'converter': null},
        {'key':'playerName', 'converter': null},
        {'key':'playerType', 'converter': null},
        {'key':'playerSummary', 'converter': null},
        {'key':'imageUrl', 'converter': null},
        {'key':'race', 'converter': null},
        {'key':'playerClass', 'converter': null},
        {'key':'level', 'converter': null},
        {'key':'experience', 'converter': null},
        {'key':'armorClass', 'converter': null},
        {'key':'gold', 'converter': null},
        {'key':'maxHitPoints', 'converter': null},
        {'key':'damage', 'converter': null},
        {'key':'tempHitPoints', 'converter': null},
        {'key':'hitDiceType', 'converter': null},
        {'key':'hitDice', 'converter': null},
        {'key':'passivePerception', 'converter': null},
        {'key':'passiveIntelligence', 'converter': null},
        {'key':'spellSaveDC', 'converter': null},
        {'key':'healthinessStatus', 'converter': function(value) { return self._importStatus(value); }},
        {'key':'magicStatus', 'converter':  function(value) { return self._importStatus(value); }},
        {'key':'trackedStatus', 'converter':  function(value) { return self._importStatus(value); }}
    ];

    /* Player Card Fields */

    // Profile
    self.publisherJid = ko.observable('');
    self.playerName = ko.observable('');
    self.playerType = ko.observable('');
    self.playerSummary = ko.observable('');
    self.name = ko.observable('');
    self.imageUrl = ko.observable('');
    self.race = ko.observable('');
    self.playerClass = ko.observable('');
    self.gold = ko.observable('');

    // Health
    self.maxHitPoints = ko.observable(0);
    self.damage = ko.observable(0);
    self.tempHitPoints = ko.observable(0);
    self.hitDiceType = ko.observable('');
    self.hitDice = ko.observable('');

    // Stats
    self.passivePerception = ko.observable(0);
    self.passiveIntelligence = ko.observable(0);
    self.spellSaveDC = ko.observable(0);
    self.level = ko.observable(0);
    self.experience = ko.observable('');
    self.armorClass = ko.observable(0);

    // Status
    self.healthinessStatus = ko.observable();
    self.magicStatus = ko.observable();
    self.trackedStatus = ko.observable();

    self.moreInfoOpen = ko.observable(false);

    self.hitDiceDisplay = ko.pureComputed(function() {
        var hitDiceString = self.hitDice() ? self.hitDice() : '';
        var hitDiceTypeString = self.hitDiceType() ? '(' + self.hitDiceType() + ')' : '';

        return hitDiceString + ' ' + hitDiceTypeString;
    });

    // Health Progress Bar Methods
    self.totalHitpoints = ko.pureComputed(function() {
        return parseInt(self.maxHitPoints()) + parseInt(self.tempHitPoints());
    });

    self.tempHitpointsRemaining = ko.pureComputed(function() {
        return (parseInt(self.tempHitPoints()) - parseInt(self.damage()));
    });

    self.regularHitpointsRemaining = ko.pureComputed(function() {
        if (self.tempHitpointsRemaining() > 0) {
            return parseInt(self.maxHitPoints());
        }
        return (parseInt(self.maxHitPoints()) - ((self.damage() ? parseInt(self.damage()) : 0) - parseInt(self.tempHitPoints())));
    });

    self.regularProgressWidth = ko.pureComputed(function() {
        return (parseInt(self.regularHitpointsRemaining()) / parseInt(self.totalHitpoints()) * 100) + '%';
    });

    self.tempProgressWidth = ko.pureComputed(function() {
        if (self.tempHitpointsRemaining() < 0) {
            return '0%';
        }
        return (parseInt(self.tempHitpointsRemaining()) / parseInt(self.totalHitpoints()) * 100) + '%';
    });

    self.isDangerous = ko.computed(function() {
        return parseInt(self.maxHitPoints()) / parseInt(self.totalHitpoints()) < self.DANGER_THRESHOLD ? true : false;
    });

    self.isWarning = ko.computed(function() {
        return parseInt(self.maxHitPoints()) / parseInt(self.totalHitpoints()) < self.WARNING_THRESHOLD ? true : false;
    });

    self.progressType = ko.computed(function() {
        var type = 'progress-bar-success';
        if (self.isWarning()) { type = 'progress-bar-warning'; }
        if (self.isDangerous()) { type = 'progress-bar-danger'; }
        return type;
    });

    // Magic Progress Bar
    self.magicProgressWidth = ko.pureComputed(function() {
        return self.magicStatus() ? (parseFloat(self.magicStatus().value()) * 100) + '%' : '0%';
    });

    // Tracked Ability Progress Bar
    self.trackedProgressWidth = ko.pureComputed(function() {
        return self.trackedStatus() ? (parseFloat(self.trackedStatus().value()) * 100) + '%' : '0%';
    });

    // Converts exported Status data into a Status object.
    self._importStatus = function(values) {
        var status = new Status();
        status.importValues(values);
        return status;
    };

    // Toggles the 'More' well.
    self.toggleMoreInfo = function() {
        self.moreInfoOpen(!self.moreInfoOpen());
    };

    // Using the passed in pCard and the playerCardFields array, this method will convert
    // a pCard into a PlayerCard.
    self.map = function(pCard) {
        if (pCard) {
            playerCardFields.forEach(function(field, idx, _) {
                var pCardField = pCard.get(field.key);
                if (pCardField.length < 1) { return; }
                if (field.converter == null) {
                    self[field.key](pCardField[0]);
                } else {
                    self[field.key](field.converter(pCardField[0]));
                }
            });
        }
    };

    self.map(pCard);
}


PersistenceService.addToRegistry(PlayerCard);

'use strict';

function CampaignOverviewViewModel() {
    var self = this;

    self.playerName = ko.observable();
    self.createdDate = ko.observable();
    self.notes = ko.observable();
    self.setting = ko.observable();
    self.createdDate = ko.observable();
    self.name = ko.observable();

    /* Public Methods */

    self.init = function() {
    };

    self.load = function() {
        var key = CharacterManager.activeCharacter().key();
        var overview = PersistenceService.findFirstBy(Campaign, 'characterId', key);
        if (overview) {
            self.playerName(overview.playerName());
            self.notes(overview.notes());
            self.name(overview.name());
            self.setting(overview.setting());
            self.createdDate(new Date(overview.createdDate()));
        }

        // Subscriptions
        Notifications.global.save.add(self.save);
    };

    self.unload = function() {
        var key = CharacterManager.activeCharacter().key();
        var overview = PersistenceService.findFirstBy(Campaign, 'characterId', key);
        if (!overview) {
            overview = new Campaign();
            overview.characterId(key);
        }
        overview.playerName(self.playerName());
        overview.createdDate(self.createdDate());
        overview.notes(self.notes());
        overview.setting(self.setting());
        overview.name(self.name());
        overview.save();

        Notifications.global.save.remove(self.save);
    };

    self.save = function() {
        var key = CharacterManager.activeCharacter().key();
        var overview = PersistenceService.findFirstBy(Campaign, 'characterId', key);
        if (!overview) {
            overview = new Campaign();
            overview.characterId(key);
        }
        overview.playerName(self.playerName());
        overview.createdDate(self.createdDate());
        overview.notes(self.notes());
        overview.setting(self.setting());
        overview.name(self.name());
        overview.save();
    };

    /* UI Methods */

    self.noteText = ko.pureComputed(function() {
        return self.notes() ? self.notes() : '';
    });

    self.placeholderText = ko.pureComputed(function() {
        return 'A Story of Wonder';
    });

    self.timeSinceLabel = ko.pureComputed(function() {
        if (!self.createdDate()) { return ''; }
        var since = self._daysSince(self.createdDate());
        var dateCreated = self.createdDate().format('longDate');
        var msg = 'Created on: ' + dateCreated + '.';
        if (since > 0) {
            msg += ' This adventure has been in progress for ' + since + ' days.';
        }
        return msg;
    });

    /* Private Methods */

    self._daysSince = function(day) {
        var now = (new Date()).getTime();
        return Math.round((now-day.getTime())/(1000*60*60*24));
    };
}

'use strict';

function PartyStatusLineViewModel() {
    var self = this;

    self.statusLine = ko.observable('');

    self.load = function() {
        Notifications.party.players.changed.add(self.dataHasChanged);
    };

    self.unload = function() {
        Notifications.party.players.changed.remove(self.dataHasChanged);
        self.clear();
    };

    self.clear = function() {
        self.statusLine('');
    };

    // Private Methods

    self.dataHasChanged = function(players) {
        self.statusLine(self.getStatusLine(players));
    };

    self.getStatusLine = function(players) {
        if (players.length < 1) { return; }
        var totalHealthiness = 0;
        var totalMagic = 0;
        var totalTrackedAbilities = 0;
        var healthinessModified = false;
        var magicModified = false;
        var trackedAbilitiesModified = false;
        var statuses = [];

        players.forEach(function(player, idx, _) {
            if (player.healthinessStatus()) {
                totalHealthiness += player.healthinessStatus().value();
                healthinessModified = true;
            }
            if (player.magicStatus()) {
                totalMagic += player.magicStatus().value();
                magicModified = true;
            }
            if (player.trackedStatus()) {
                totalTrackedAbilities += player.trackedStatus().value();
                trackedAbilitiesModified = true;
            }
        });

        if (healthinessModified) {
            statuses.push(StatusWeightPair.determinePhraseAndColor(getHealthTypeEnum(), totalHealthiness / players.length));
        }

        if (magicModified) {
            statuses.push(StatusWeightPair.determinePhraseAndColor(getMagicTypeEnum(), totalMagic / players.length));
        }

        if (trackedAbilitiesModified) {
            statuses.push(StatusWeightPair.determinePhraseAndColor(getTrackedTypeEnum(), totalTrackedAbilities / players.length));
        }

        return 'Your party is ' + statuses.map(function(e, i, _) {
            var status = '<span class="text-' + e.color + '">' + e.status + '</span>';
            if (statuses.length > 1 && i == statuses.length - 1) {
                return 'and ' + status;
            } else if (statuses.length > 2) {
                return status + ',&nbsp;';
            } else if (statuses.length > 1) {
                return status + '&nbsp;';
            } else {
                return status;
            }
        }).join('') + '.';
    };
}

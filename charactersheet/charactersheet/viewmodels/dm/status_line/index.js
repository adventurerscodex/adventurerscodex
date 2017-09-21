import ko from 'knockout'

import { PlayerCard,
    PlayerTypes } from 'charactersheet/models'
import { Notifications } from 'charactersheet/utilities'
import { ChatServiceManager } from 'charactersheet/services'

import template from './index.html'

export function PartyStatusLineViewModel() {
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

    self.dataHasChanged = function(pCards) {
        var players = pCards.map(function(inputPCard, idx, _) {
            return new PlayerCard(inputPCard);
        });
        self.statusLine(self.getStatusLine(players));
    };

    self.getStatusLine = function(players) {
        var chat = ChatServiceManager.sharedService();
        if (chat.currentPartyNode == null || players.length < 1) { return ''; }
        var totalHealthiness = 0;
        var totalMagic = 0;
        var totalTrackedAbilities = 0;
        var healthinessModified = false;
        var magicModified = false;
        var trackedAbilitiesModified = false;
        var statuses = [];
        var numberOfHealthinessStatuses = 0;
        var numberOfMagicStatuses = 0;
        var numberOfTrackedStatuses = 0;

        players.forEach(function(player, idx, _) {
            if (player.playerType() === PlayerTypes.characterPlayerType.key) {
                if (player.healthinessStatus()) {
                    totalHealthiness += player.healthinessStatus().value();
                    healthinessModified = true;
                    numberOfHealthinessStatuses++;
                }
                if (player.magicStatus()) {
                    totalMagic += player.magicStatus().value();
                    magicModified = true;
                    numberOfMagicStatuses++;
                }
                if (player.trackedStatus()) {
                    totalTrackedAbilities += player.trackedStatus().value();
                    trackedAbilitiesModified = true;
                    numberOfTrackedStatuses++;
                }
            }
        });

        if (healthinessModified) {
            statuses.push(StatusWeightPair.determinePhraseAndColor(getHealthTypeEnum(), totalHealthiness / numberOfHealthinessStatuses));
        }

        if (magicModified) {
            statuses.push(StatusWeightPair.determinePhraseAndColor(getMagicTypeEnum(), totalMagic / numberOfMagicStatuses));
        }

        if (trackedAbilitiesModified) {
            statuses.push(StatusWeightPair.determinePhraseAndColor(getTrackedTypeEnum(), totalTrackedAbilities / numberOfTrackedStatuses));
        }

        if (statuses.length < 1) { return ''; }

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

ko.components.register('party-status-line', {
    viewModel: PartyStatusLineViewModel,
    template: template
  })
'use strict';


function PartyViewModel() {
    var self = this;

    self.players = ko.observableArray();
    self.partyStatus = ko.observable();

    self.load = function() {
        Notifications.xmpp.routes.pcard.add(self.handlePCard);
    };

    self.unload = function() {
        Notifications.xmpp.routes.pcard.remove(self.handlePCard);
    };

    self.handlePCard = function(inputPCard) {
        var publisherJid;
        var isNewPlayer = true;
        inputPCard.forEach(function(field, idx, _) {
            if (field.name === 'publisherJid') {
                publisherJid = field.value;
            }
        });
        self.players().forEach(function(player, idx, _) {
            if (player.publisherJid() === publisherJid) {
                player.map(pCard.fromEntries(inputPCard));
                isNewPlayer = false;
            }
        });
        if (isNewPlayer) {
            self.players.push(new PlayerCard(pCard.fromEntries(inputPCard)));
        }
        self.partyStatus(self.calculatePartyStatus());
    };

    self.calculatePartyStatus = function() {
        if (self.players().length < 1) { return; }
        var partyStatus = 'Your party is ';
        var totalHealthiness = 0;
        var totalMagic = 0;
        var totalTrackedAbilities = 0;

        self.players().forEach(function(player, idx, _) {
            if (player.healthinessStatus()) {
                totalHealthiness += player.healthinessStatus().value();
            }
            if (player.magicStatus()) {
                totalMagic += player.magicStatus().value();
            }
            if (player.trackedStatus()) {
                totalTrackedAbilities += player.trackedStatus().value();
            }
        });

        var statuses = [];
        var averageHealthiness = totalHealthiness ? totalHealthiness / self.players().length : undefined;
        var averageMagic = totalMagic ? totalMagic / self.players().length : undefined;
        var averageTrackedAbilities = totalTrackedAbilities ? totalTrackedAbilities / self.players().length : undefined;

        if (averageHealthiness) {
            statuses.push(StatusWeightPair.determinePhraseAndColor(getHealthTypeEnum(), averageHealthiness));
        }

        if (averageMagic) {
            statuses.push(StatusWeightPair.determinePhraseAndColor(getMagicTypeEnum(), averageHealthiness));
        }

        if (averageTrackedAbilities) {
            statuses.push(StatusWeightPair.determinePhraseAndColor(getTrackedTypeEnum(), averageHealthiness));
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
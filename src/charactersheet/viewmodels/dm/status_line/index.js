import autoBind from 'auto-bind';
import {
    PlayerTypes,
    StatusWeightPair
} from 'charactersheet/models';
import {
    getHealthTypeEnum,
    getMagicTypeEnum,
    getTrackedTypeEnum
} from 'charactersheet/models/common/status_weight_pair';
import { Notifications } from 'charactersheet/utilities';
import { PartyService } from 'charactersheet/services';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import ko from 'knockout';
import template from './index.html';

class PartyStatusLineViewModel extends ViewModel {

    constructor(params) {
        super();
        autoBind(this);
        this.party = ko.observable(PartyService.party);
        this.character = params.character;
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();

        this.subscriptions.push(Notifications.party.changed.add(this.partyDidChange));
    }

    // UI

    statusLine = ko.pureComputed(() => {
        if (!this.party()) {
            return '';
        }
        const players = this.party().members;
        if (players.length === 0) {
            return '';
        }

        const [hitPoints, totalHitPoints] = (
            players
            .map(player => {
                const maxHp = player.maxHitPoints - player.maxHitPointsReductionDamage;
                const hp = maxHp - player.damage;
                return [hp, maxHp];
            })
            .reduce(([remaining, total], [hp, maxHp]) => (
                [remaining + hp, total + maxHp]
            ))
        );

        const [spellSlots, totalSpellSlots] = (
            players
            .map(({ remainingSpellSlots, totalSpellSlots }) => (
                [remainingSpellSlots, totalSpellSlots]
            ))
            .reduce(([remaining, total], [remainingSpellSlots, totalSpellSlots]) => (
                [remaining + remainingSpellSlots, total + totalSpellSlots]
            ))
        );

        const [trackables, totalTrackables] = (
            players
            .map(({ remainingTrackables, totalTrackables }) => (
                [remainingTrackables, totalTrackables]
            ))
            .reduce(([remaining, total], [remainingTrackables, totalTrackables]) => (
                [remaining + remainingTrackables, total + totalTrackables]
            ))
        );

        const statuses = [
            StatusWeightPair.determinePhraseAndColor(getHealthTypeEnum(), hitPoints / totalHitPoints),
            StatusWeightPair.determinePhraseAndColor(getMagicTypeEnum(), spellSlots / totalSpellSlots),
            StatusWeightPair.determinePhraseAndColor(getTrackedTypeEnum(), trackables / totalTrackables),
        ];

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

    });

    // Private

    partyDidChange(party) {
        this.party(party);
    }
}

ko.components.register('party-status-line', {
    viewModel: PartyStatusLineViewModel,
    template: template
});

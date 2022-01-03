import autoBind from 'auto-bind';
import { observable, components, pureComputed } from 'knockout';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import { PartyService } from 'charactersheet/services/common';
import { Notifications } from 'charactersheet/utilities';
import template from './index.html';


export class PlayerCardViewModel extends ViewModel {

    constructor(params) {
        super(params);
        autoBind(this);
        this.player = params.player;
        this.index = params.index;

        this.isOnline = observable(
            PartyService.playerIsOnline(this.player.uuid)
        );
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();

        const partyDidChange = Notifications.party.changed.add(this.partyDidChange);
        this.subscriptions.push(partyDidChange);
    }

    // UI

    hpPercent() {
        return (
            (this.player.maxHitPoints - this.player.maxHitPointsReductionDamage - this.player.damage)
                / (this.player.maxHitPoints - this.player.maxHitPointsReductionDamage + this.player.tempHitPoints)
        );
    }

    tempHpPercent() {
        return (
            this.player.tempHitPoints
                / (this.player.maxHitPoints - this.player.maxHitPointsReductionDamage + this.player.tempHitPoints)
        );
    }

    hpProgressBarCss() {
        const percent = this.hpPercent();
        if (percent <= 0.2) {
            return 'progress-bar-danger';
        } else if (percent <= 0.5) {
            return 'progress-bar-warning';
        } else {
            return 'progress-bar-success';
        }
    }

    spellSlotPercent() {
        return (this.player.remainingSpellSlots / this.player.totalSpellSlots);
    }

    trackedPercent() {
        return (this.player.remainingTrackables / this.player.totalTrackables);
    }

    statusIndicatorClass = pureComputed(() => (
        this.isOnline() ? 'success' : 'failure'
    ))

    // Events

    partyDidChange() {
        this.isOnline(PartyService.playerIsOnline(this.player.uuid));
    }
}


components.register('player-card', {
    viewModel: PlayerCardViewModel,
    template
});

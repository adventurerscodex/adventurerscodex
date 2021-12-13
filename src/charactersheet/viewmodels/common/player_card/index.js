import autoBind from 'auto-bind';
import { components } from 'knockout';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import template from './index.html';


export class PlayerCardViewModel extends ViewModel {

    constructor(params) {
        super(params);
        autoBind(this);
        this.player = params.player;
        this.index = params.index;
    }

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
}


components.register('player-card', {
    viewModel: PlayerCardViewModel,
    template
});

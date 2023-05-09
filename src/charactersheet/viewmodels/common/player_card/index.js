import autoBind from 'auto-bind';
import { capitalize } from 'lodash';
import { observable, components, pureComputed } from 'knockout';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import { PartyService } from 'charactersheet/services/common';
import { CoreManager, Notifications } from 'charactersheet/utilities';
import { PlayerTypes } from 'charactersheet/models/common';
import template from './index.html';
import './index.css';

export class PlayerCardViewModel extends ViewModel {

    constructor(params) {
        super(params);
        autoBind(this);
        this.player = params.player;
        this.index = params.index;

        this.isOnline = observable(
            PartyService.playerIsOnline(this.player.uuid)
        );
        const key = CoreManager.activeCore().type.name();
        this.playerType = observable(key);
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();

        this.subscriptions.push(Notifications.coreManager.changed.add(this.coreDidChange));
        this.subscriptions.push(Notifications.party.changed.add(this.partyDidChange));
    }

    // UI

    isDM = pureComputed(() => (
        PlayerTypes.dm.key === this.playerType()
    ));

    currentMaxHp() {
        return this.player.maxHitPoints - this.player.maxHitPointsReductionDamage;
    }

    currentHp() {
        return this.currentMaxHp() - this.currentDamage();
    }

    currentTempHp() {
        return this.player.tempHitPoints;
    }

    currentDamage() {
        return this.player.damage;
    }

    hpPercent() {
        return (
            (this.currentHp()) / (this.currentMaxHp() + this.currentTempHp())
        );
    }

    tempHpPercent() {
        return (this.currentTempHp() / (this.currentMaxHp() + this.currentTempHp()));
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

    currentSpellSlots() {
        return this.player.remainingSpellSlots;
    }

    currentMaxSpellSlots() {
        return this.player.totalSpellSlots;
    }

    spellSlotPercent() {
        return (this.currentSpellSlots() / this.currentMaxSpellSlots());
    }

    currentTrackables() {
        return this.player.remainingTrackables;
    }

    currentMaxTrackables() {
        return this.player.totalTrackables;
    }

    trackedPercent() {
        return (this.currentTrackables() / this.currentMaxTrackables());
    }

    statusIndicatorClass = pureComputed(() => (
        this.isOnline() ? 'success' : 'failure'
    ));

    popoverHtml() {
        if (!this.player.isActivePatron) {
            return '';
        }
        const name = this.player.name || 'Player';
        const tier = capitalize(`${this.player.canonicalPatreonTier} Tier`);
        return `${name} is a <a href="https://www.patreon.com/adventurerscodex" target='_blank'>${tier} supporter</a> on Patreon.`
    }

    // Events

    partyDidChange() {
        this.isOnline(PartyService.playerIsOnline(this.player.uuid));
    }

    coreDidChange() {
        this.party(null);

        const key = CoreManager.activeCore().type.name();
        this.playerType(PlayerTypes[key]);
    }
}


components.register('player-card', {
    viewModel: PlayerCardViewModel,
    template
});

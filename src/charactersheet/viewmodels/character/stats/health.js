import 'bin/knockout-circular-progress';
import {
    DeathSave,
    Health,
    HitDice,
    Profile
} from 'charactersheet/models/character';
import { defer, find } from 'lodash';

import { AbstractViewModel } from 'charactersheet/viewmodels/abstract';

import { CoreManager } from 'charactersheet/utilities';
import { DELAY } from 'charactersheet/constants';
import { Notifications } from 'charactersheet/utilities';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './health.html';

class StatsHealthViewModel {
    constructor(params) {
        this.loaded = ko.observable(false);
        this.forceCardResize = params.forceCardResize;
        this.massiveDamageTaken = params.massiveDamageTaken;
        this.outerShow = ko.observable(false);//params.outerShow;
        this.profile = ko.observable(new Profile());
        this.hitDice = ko.observable(new HitDice());
        this.health = ko.observable(new Health());

        this.hitDiceList = ko.observableArray([]);

        this.healInput = ko.observable(null);
        this.tempInput = ko.observable(null);
        this.dmgInput = ko.observable(null);
        this.subscriptions = [];
        autoBind(this);

    }

    async load() {
        var key = CoreManager.activeCore().uuid();
        await this.hitDice().load({uuid: key});
        await this.health().load({uuid: key});
        await this.profile().load({uuid: key});

        this.calculateHitDice();
        this.setUpSubscriptions();
        this.loaded(true);
    }

    refresh = async () => {
        var key = CoreManager.activeCore().uuid();
        await this.profile().load({uuid: key});
        await this.hitDice().load({uuid: key});
        await this.health().load({uuid: key});
        this.forceCardResize();
    };

    setUpSubscriptions = () => {
        this.subscriptions.push(this.outerShow.subscribe(this.subscribeToVisible));
        this.subscriptions.push(Notifications.events.longRest.add(this.resetOnLongRest));
        this.subscriptions.push(Notifications.profile.changed.add(this.profileDidUpdate));
        this.subscriptions.push(Notifications.health.changed.add(this.healthDidUpdate));
    }

    disposeOfSubscriptions() {
        const disposeOfDisposable = (disposable) => {
            if (disposable.dispose) {
                disposable.dispose();
            } else if (disposable.detach) {
                disposable.detach();
            }

        };
        this.subscriptions.map((disposable) => defer(disposeOfDisposable, disposable));
        this.subscriptions = [];
    }

    dispose() {
        setTimeout(this.disposeOfSubscriptions, DELAY.DISPOSE);
    }

    healthDidUpdate = (health) => {
        this.health().importValues(health.exportValues());
    }

    subscribeToVisible = async () => {
        if (this.outerShow()) {
            await this.refresh();
        }
    }
    // Hit Point Display ******************************************************
    hpText = ko.pureComputed(() => {
        let tempHp = '';
        if (this.health().tempHitPointsRemaining()) {
            tempHp = `<span style="color: #71D4E8">+${this.health().tempHitPointsRemaining()}</span>`;
        }
        return `${this.health().regularHitPointsRemaining()} ${tempHp}<br />of&nbsp;${this.health().maxHitPoints()}&nbsp;HP`;
    });

    // Configure the knockout-circular-progress display for health
    hpChart = ko.pureComputed(()=>({
        data: {
            text: {value: this.hpText()},
            value: this.health().regularHitPointsRemaining(),
            maxValue: this.health().maxHitPoints()
        },
        config: {
            strokeWidth: 12,
            from: { color: this.getHealthColor() },
            to: { color: this.getHealthColor() },
            text: {
                className: 'lead hpChart'
            }
        }
    }));

    getHealthColor = () => {
        if (this.health().isDangerous()) {
            return '#e74c3c';
        } else if (this.health().isWarning()) {
            return '#f39c12';
        }
        return '#18bc9c';
    };

    // Configure the knockout-circular-progress display for tempHp
    tempHpChart =  ko.pureComputed(()=>({
        data: {
            text: null,
            value: this.health().tempHitPointsRemaining(),
            maxValue: this.health().maxHitPoints()
        },
        config: {
            trailColor: '#FFF',
            strokeWidth: 6,
            from: { color: this.tempHpColor },
            to: { color: this.tempHpColor }
        }
    }));

    tempHpColor = '#71D4E8';

    // Hit Point Interaction ***************************************************
    handleHeal = async () => {
        let healValue = -1;
        if (this.healInput()) {
            healValue = 0 - parseInt(this.healInput());
        }
        // TODO: damage handler should not side-effect. However,
        // getting it working this way was difficult, and redoing how
        // damage is calculated a 3rd time is smelling like scope creep.
        // damageHandler updated this.health()
        this.damageHandler(healValue);
        if (this.health().damage() < this.health().maxHitPoints()) {
            this.health().dying(false);
        }
        await this.health().save();
        this.healInput(null);
        $('#health-heal-input').blur();
    };

    handleTemp = async () => {
        let tempValue = 1;
        if (this.tempInput()) {
            tempValue = parseInt(this.tempInput());
        } else {
            // allow the user to increment via the button;
            tempValue = parseInt(this.health().tempHitPoints()) + 1;
        }
        this.health().tempHitPoints(tempValue);
        await this.health().save();
        this.tempInput(null);
        $('#health-temp-input').blur();
    };

    handleDmg = async () => {
        let damageValue = 1;
        if (this.dmgInput()) {
            damageValue = parseInt(this.dmgInput());
        }
        // TODO: damage handler should not side-effect. However,
        // getting it working this way was difficult, and redoing how
        // damage is calculated a 3rd time is smelling like scope creep.
        // damageHandler updated this.health()
        this.damageHandler(damageValue);
        if (this.health().damage() >= this.health().maxHitPoints()) {
            this.health().dying(true);
        }

        await this.health().save();
        this.dmgInput(null);
        $('#health-dmg-input').blur();
    };

    damageHandler = ko.computed({
        read: function() {
            return this.health ? this.health().damage() : 0;
        },
        write: function(value) {
            const currentValue = parseInt(value);
            const currentDamage = parseInt(this.health().damage());
            const currentTempHP = parseInt(this.health().tempHitPoints());
            const maxHitPoints = parseInt(this.health().maxHitPoints());
            let newDamage;
            if (value < 0) {
                // healing
                newDamage = currentDamage + currentValue;
                if (newDamage < 0) {
                    newDamage = 0;
                }
            } else if (currentTempHP) {
                // Find the damage delta, then apply to temp hit Points first.
                let remainingTempHP = currentTempHP - currentValue;
                if (remainingTempHP >= 0 ) {
                    // New damage value did not eliminate temporary hit Points
                    // reduce temporary hit Points, and do not apply to damage.
                    this.health().tempHitPoints(remainingTempHP);
                    newDamage = currentDamage;
                } else { // remainingTempHP is negative. Damage continues on
                        // to hit points
                    this.health().tempHitPoints(0);
                    newDamage = currentDamage - remainingTempHP;
                }
            } else {
                newDamage = currentDamage + currentValue;
            }
            if (newDamage > maxHitPoints) {
                if (newDamage >= maxHitPoints * 2) {
                    // Trigger Massive Damage.
                    this.massiveDamageTaken(true);
                }
                newDamage = maxHitPoints;
            }
            this.health().damage(newDamage);
        },
        owner: this
    });

    // Hit Point Interaction ***************************************************
    profileDidUpdate = async (profile) => {
        this.profile().importValues(profile.exportValues());
        this.calculateHitDice();
    };

    calculateHitDice = () => {
        const level = this.profile().level();

        this.hitDiceList(new Array(level));
        // TODO: support multiple hit die types for multiclasses
        for (var i = 0; i < level; i++) {
            const isVisible = (level - this.hitDice().used()) > i;
            this.hitDiceList()[i] = ko.observable(isVisible);
        }
        // Tell the view to render the list again.
        this.hitDiceList.valueHasMutated();
    };

    toggleHitDie = async (isAvailable) => {
        if (isAvailable) {
            this.hitDice().used(this.hitDice().used() + 1);
        } else {
            this.hitDice().used(this.hitDice().used() - 1);
        }
        await this.saveHitDice();
    }

    saveHitDice = async () => {
        await this.hitDice().save();
        this.calculateHitDice();
    }

    /**
     * Reset the hit dice to an unused state up to the floor of half of the
     * character's level.
     *
     * This will be used primarily for long rest resets.
     */
    resetHitDice = async () => {
        const level = this.profile().level();
        const restoredHitDice = Math.floor(level / 2) < 1 ? 1 : Math.floor(level / 2);
        const remainingHitDice = this.hitDice().used() - restoredHitDice;
        if (remainingHitDice < 0) {
            this.hitDice().used(0);
        } else {
            this.hitDice().used(remainingHitDice);
        }
        await this.saveHitDice();
    };

    /**
     * Fired when a long rest notification is recieved.
     * Resets health and hit dice.
     */
    resetOnLongRest = async () => {
        this.health().damage(0);
        this.health().tempHitPoints(0);
        await this.health().save();
        await this.resetHitDice();
    };

    validation = {
        rules: {
            maxHitPoints: {
                min: 0,
                max: 1000000,
                required: true,
                type: 'number'
            },
            tempHitPoints: {
                min: 0,
                max: 1000000,
                required: true,
                type: 'number'
            },
            damage: {
                min: 0,
                max: 1000000,
                required: true,
                type: 'number'
            },
            type: {
                required: true,
                maxlength: 32
            }
        }
    };

}

ko.components.register('stats-health-view', {
    viewModel: StatsHealthViewModel,
    template: template
});

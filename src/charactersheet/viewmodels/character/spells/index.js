import { Spell, SpellSlot, SpellStats } from 'charactersheet/models';
import { filter, maxBy } from 'lodash';

import { AbstractTabularViewModel } from 'charactersheet/viewmodels/abstract';
import { Notifications } from 'charactersheet/utilities';
import { SortService } from 'charactersheet/services/common';
import { SpellFormViewModel } from './form';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';

class SpellbookViewModel extends AbstractTabularViewModel {
    constructor(params) {
        super(params);
        this.addFormId = '#add-spell';
        this.collapseAllId = '#spells-pane';

        this.filteredByCastable = ko.observable(false);
        this.spellStats = ko.observable(new SpellStats());
        this.spellSlots = ko.observableArray([]);
        autoBind(this);
    }

    modelClass () {
        return Spell;
    }

    async refresh () {
        await super.refresh();
        const stats = await SpellStats.ps.read({ uuid: this.coreKey });
        this.spellStats().importValues(stats.object.exportValues());
        const spellSlots = await SpellSlot.ps.list({ coreUuid: this.coreKey });
        this.spellSlots(spellSlots.objects);
    }

    sorts() {
        return {
            ...super.sorts(),
            'typeLabel asc': { field: 'typeLabel', direction: 'asc'},
            'typeLabel desc': { field: 'typeLabel', direction: 'desc'},
            'damageType asc': { field: 'damageType', direction: 'asc'},
            'damageType desc': { field: 'damageType', direction: 'desc'},
            'damage asc': { field: 'damage', direction: 'asc'},
            'damage desc': { field: 'damage', direction: 'desc'},
            'level asc': { field: 'level', direction: 'asc', numeric: true},
            'level desc': { field: 'level', direction: 'desc', numeric: true},
            'castingTime asc': { field: 'castingTime', direction: 'asc'},
            'castingTime desc': { field: 'castingTime', direction: 'desc'},
            'range asc': { field: 'range', direction: 'asc'},
            'range desc': { field: 'range', direction: 'desc'}
        };
    }

    highestLevelSpellSlot = ko.pureComputed(() => {
        const availableSlots = filter(this.spellSlots(), (spellSlot)=> (spellSlot.used() < spellSlot.max()));
        const highestSlot = maxBy(availableSlots, (spellSlot) => (spellSlot.level()));
        if (highestSlot) {
            return highestSlot.level();
        }
        return 0;
    })

    filteredAndSortedEntities = ko.pureComputed(() =>  {
        let spellbook = this.entities();
        if (this.filteredByCastable()) {
            spellbook = this.entities().filter(this.spellIsCastable, this);
        }
        return SortService.sortAndFilter(spellbook, this.sort(), null);
    }, this);

    toggleSpellFilter = () => {
        this.filteredByCastable(!this.filteredByCastable());
    }

    getDefaultSort () {
        return this.sorts()['level asc'];
    }

    setUpSubscriptions () {
        super.setUpSubscriptions();
        this.subscriptions.push(Notifications.spellslot.added.add(this.addToList));
        this.subscriptions.push(Notifications.spellslot.changed.add(this.replaceInList));
        this.subscriptions.push(Notifications.spellslot.deleted.add(this.removeFromList));
        this.subscriptions.push(Notifications.spellslot.changed.add(this.updateSpellSlots, this));
        this.subscriptions.push(Notifications.spellslot.added.add(this.updateSpellSlots, this));
        this.subscriptions.push(Notifications.spellslot.deleted.add(this.updateSpellSlots, this));
        this.subscriptions.push(Notifications.spellstats.changed.add(this.updateSpellStats, this));
    }

    updateSpellStats = async (stats) => {
        this.spellStats().importValues(stats.exportValues());
    }

    updateSpellSlots = async (slot) => {
        const response = await SpellSlot.ps.list({ coreUuid: this.coreKey });
        this.spellSlots(response.objects);
    }

    spellIsCastable = (spell) => {
        if (spell.level() === 0) {
            return true;
        } else if (spell.level() > this.highestLevelSpellSlot()) {
            return false;
        } else if (spell.level() === 0) {
            return true;
        } else if ( spell.alwaysPrepared() === true) {
            return true;
        } else if (spell.prepared() === true) {
            return true;
        }
        return false;
    }

    spellTypeLabel = (spell) => {
        switch(spell.type()) {
        case 'Savings Throw': {
            return (
              `Save vs <strong>${spell.spellSaveAttribute()}</strong>` +
              ` <span class="small">DC:<strong>${this.spellStats().spellSaveDc()}</strong></span>`);
        }
        case 'Melee Spell Attack': {
            const spellAttackLabel = this.spellStats().spellAttackBonus();
            let sign = ' +';
            if (parseInt(spellAttackLabel) < 0 ) {
                sign = ' -';
            }
            return (`Melee Spell: <strong>${sign}${spellAttackLabel}</strong>`);
        }
        case 'Ranged Spell Attack': {
            const spellAttackLabel = this.spellStats().spellAttackBonus();
            let sign = ' +';
            if (parseInt(spellAttackLabel) < 0 ) {
                sign = ' -';
            }
            return (`Ranged Spell: <strong>${sign}${spellAttackLabel}</strong>`);
        }
        default:
            return spell.type();
        }
    };

    memorizeSpell = async (data, event) => {
        event.stopPropagation();
        if(!(data.level() == 0  || data.alwaysPrepared())) {
            data.prepared(!data.prepared());
            await data.save();
        }
    };

    numberOfPrepared = ko.pureComputed(() => {
        if(this.entities()) {
            return filter(this.entities(), (spell)=>(spell.prepared() === true)).length;
        }
        return 0;
    }, this);

    numberOfSpells = ko.computed(() => {
        return this.entities() ? this.entities().length : 0;
    }, this);
}

ko.components.register('spells', {
    viewModel: SpellbookViewModel,
    template: template
});

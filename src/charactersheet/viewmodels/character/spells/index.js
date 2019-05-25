import {
    CoreManager,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { Spell, SpellSlot, SpellStats } from 'charactersheet/models';
import { filter, maxBy } from 'lodash';

import { ACTableComponent } from 'charactersheet/components/table-component';
import { SortService } from 'charactersheet/services/common';
import { SpellDetailViewModel } from './view';
import { SpellFormViewModel } from './form';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';


class SpellbookViewModel extends ACTableComponent {
    constructor(params) {
        super(params);
        this.filteredByCastable = ko.observable(false);
        this.spellStats = ko.observable(new SpellStats());
        this.spellSlots = ko.observableArray([]);
        this.addFormId = '#add-spell';
        this.collapseAllId = '#spells-pane';
        autoBind(this);
    }

    async load () {
        super.load();
        const key = CoreManager.activeCore().uuid();
        const stats = await SpellStats.ps.read({uuid: key});
        this.spellStats().importValues(stats.object.exportValues());
        const spellSlots = await SpellSlot.ps.list({coreUuid: key});
        this.spellSlots(spellSlots.objects);
    }

    modelClass = () => {
        return Spell;
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

    getDefaultSort () {
        return this.sorts()['level asc'];
    }

    setUpSubscriptions () {
        super.setUpSubscriptions();
        Notifications.spellSlots.changed.add(this.updateSpellSlots);
    }

    updateSpellSlots = async () => {
        const key = CoreManager.activeCore().uuid();
        const response = await SpellSlot.ps.list({coreUuid: key});
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
            return ('Save vs <strong>' + spell.spellSaveAttribute() + '</strong> <span class="small">DC:' + this.spellStats().spellSaveDc() + '</span>');
        }
        case 'Melee Spell Attack': {
            const spellAttackLabel = this.spellStats().spellAttackBonus();
            let sign = ' +';
            if (parseInt(spellAttackLabel) < 0 ) {
                sign = ' -';
            }
            return ('Melee Spell: <strong>' + sign + spellAttackLabel + '</strong>');
        }
        case 'Ranged Spell Attack': {
            const spellAttackLabel = this.spellStats().spellAttackBonus();
            let sign = ' +';
            if (parseInt(spellAttackLabel) < 0 ) {
                sign = ' -';
            }
            return ('Ranged Spell: <strong>' + sign + spellAttackLabel + '</strong>');
        }
        default:
            return spell.type();
        }
    };

    memorizeSpell = async (data, event) => {
        event.stopPropagation();
        if(!(data.level() == 0  || data.alwaysPrepared())) {
            data.prepared(!data.prepared());
            const response = await data.ps.save();
            this.replaceInList(response.object);
        }
    };

    trunc = function(string, len=20) {
        return Utility.string.truncateStringAtLength(string(), len);
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

import {
    CoreManager,
    DataRepository,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { Spell, SpellStats } from 'charactersheet/models';
import { debounce, filter } from 'lodash';

import { ACTableComponent } from 'charactersheet/components/table-component';
import { SortService } from 'charactersheet/services/common';
import { SpellDetailViewModel } from './view';
import { SpellFormViewModel } from './form';

import ko from 'knockout';
import template from './index.html';


class SpellbookViewModel extends ACTableComponent {
    constructor(params) {
        super(params);
        this.filteredByCastable = ko.observable(false);
        this.highestLevelSpellSlot = ko.observable(9);
        this.spellStats = ko.observable(new SpellStats());
        this.addFormId = '#add-spell';
        this.collapseAllId = '#spell-pane';
    }

    async load () {
        super.load();
        const key = CoreManager.activeCore().uuid();
        const stats = await SpellStats.ps.read({uuid: key});
        this.spellStats().importValues(stats.object.exportValues());
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

    filteredAndSortedEntities = ko.pureComputed(() =>  {
        let spellbook = this.entities();
        if (this.filteredByCastable()) {
            spellbook = this.entities().filter(this.spellIsCastable, this);
        }
        return SortService.sortAndFilter(spellbook, this.sort(), null);
    });

    getDefaultSort () {
        return this.sorts()['level asc'];
    }

    spellIsCastable = (spell) => {
        if (spell.level() > this.highestLevelSpellSlot()) {
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

    collapseAll = () => {
        $('#spells-pane .collapse.in').collapse('hide');
    }
}

ko.components.register('spells', {
    viewModel: SpellbookViewModel,
    template: template
});

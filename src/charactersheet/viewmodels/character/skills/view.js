import 'bin/popover_bind';

import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';

import { Skill } from 'charactersheet/models/character';

import { SortService } from 'charactersheet/services/common';

import ko from 'knockout';
import template from './view.html';

class ACViewModel {
    constructor(params) {
        // Card Properties
        this.containerId = ko.utils.unwrapObservable(params.containerId);
        this.showBack = params.showBack;
        this.flip = params.flip;

        this.loaded = ko.observable(false);
    }

    async load() {
        this.loaded(false);
        await this.refresh();
        this.setUpSubscriptions();
        this.loaded(true);
    }

    async refresh() {
        throw('refresh must be defined by subclasses of ACViewModel');
    }

    setUpSubscriptions() {
        this.showBack.subscribe(this.subscribeToShowForm);
    }

    subscribeToShowForm = () => {
        if (!this.showBack()) {
            this.refresh();
        }
    }
}

export class SkillsViewModel extends ACViewModel {
    constructor(params) {
        super(params);
        this.skills = ko.observableArray([]);
        this.sort = ko.observable(SkillsViewModel.sorts['name asc']);
    }

    static sorts = {
        'name asc': { field: 'name', direction: 'asc'},
        'name desc': { field: 'name', direction: 'desc'},
        'modifier asc': { field: 'modifier', direction: 'asc'},
        'modifier desc': { field: 'modifier', direction: 'desc'},
        'proficiency asc': { field: 'proficiency', direction: 'asc', booleanType: true},
        'proficiency desc': { field: 'proficiency', direction: 'desc', booleanType: true}
    };

    async load() {
        await super.load();
        // Subscriptions
        this.monitorSubscriptions();
    }

    refresh = async () => {
        const key = CoreManager.activeCore().uuid();
        // Fetch skills
        const response = await Skill.ps.list({coreUuid: key});
        this.skills(response.objects);
        await this.updateValues();
    }

    monitorSubscriptions = () => {
        Notifications.abilityScores.changed.add(this.updateValues);
        Notifications.proficiencyBonus.changed.add(this.updateValues);
    }


    // loops through all the skills to calculate bonuses
    updateValues = async () => {
        const skillUpdates = this.skills().map((skill) => {
            skill.updateBonuses();
        });
        await Promise.all(skillUpdates);
    };

    /**
     * Filters and sorts the skills for presentation in a table.
     */
    filteredAndSortedSkills = ko.pureComputed(() => {
        return SortService.sortAndFilter(this.skills(), this.sort(), null);
    });

    /**
     * Determines whether a column should have an up/down/no arrow for sorting.
     */
    sortArrow = (columnName) => {
        return SortService.sortArrow(columnName, this.sort());
    };

    /**
     * Given a column name, determine the current sort type & order.
     */
    sortBy = (columnName) => {
        this.sort(SortService.sortForName(this.sort(),
            columnName, SkillsViewModel.sorts));
    };
}

ko.components.register('skills-view', {
    viewModel: SkillsViewModel,
    template: template
});

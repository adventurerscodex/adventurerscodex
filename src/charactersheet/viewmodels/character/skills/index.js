import 'bin/knockout-bootstrap-modal';
import {
    CoreManager,
    Utility
} from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';
import { Skill } from 'charactersheet/models/character';
import { SortService } from 'charactersheet/services/common';
import ko from 'knockout';
import template from './index.html';

export function SkillsViewModel() {
    var self = this;

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc'},
        'name desc': { field: 'name', direction: 'desc'},
        'modifier asc': { field: 'modifier', direction: 'asc'},
        'modifier desc': { field: 'modifier', direction: 'desc'},
        'proficiency asc': { field: 'proficiency', direction: 'asc', booleanType: true},
        'proficiency desc': { field: 'proficiency', direction: 'desc', booleanType: true}
    };

    self.blankSkill = ko.observable(new Skill());
    self.newModalOpen = ko.observable(false);
    self.editModalOpen = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable();
    self.skills = ko.observableArray([]);
    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['name asc']);

    self.load = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await Skill.ps.list({coreUuid: key});
        self.skills(response.objects);

        //Subscriptions
        Notifications.abilityScores.changed.add(self.updateValues);
        Notifications.otherStats.proficiency.changed.add(self.updateValues);
        self.skills().forEach(function(e, i, _) {
            e.updateBonuses();
            if (e.name() === 'Perception') {
                e.bonus.subscribe(self.perceptionHasChanged);
            }
        });
    };

    self.updateValues = () => {
        self.skills().forEach(function(e, i, _) {
            e.updateBonuses();
        });
    };

    /* UI Methods */

    /**
     * Filters and sorts the skills for presentation in a table.
     */
    self.filteredAndSortedSkills = ko.computed(function() {
        return SortService.sortAndFilter(self.skills(), self.sort(), null);
    });

    /**
     * Determines whether a column should have an up/down/no arrow for sorting.
     */
    self.sortArrow = function(columnName) {
        return SortService.sortArrow(columnName, self.sort());
    };

    /**
     * Given a column name, determine the current sort type & order.
     */
    self.sortBy = function(columnName) {
        self.sort(SortService.sortForName(self.sort(),
            columnName, self.sorts));
    };

    // Edit Modal Methods
    self.editModifierHasFocus = ko.observable(false);

    self.editModalFinishedAnimating = function() {
        self.editModifierHasFocus(true);
    };

    self.editModalFinishedClosing = async () => {
        if (self.editModalOpen()) {
            const response = await self.currentEditItem().ps.save();
            Utility.array.updateElement(self.skills(), response.object, self.editItemIndex);
        }

        self.editModalOpen(false);
    };

    // New Modal Methods
    self.newSkillFieldHasFocus = ko.observable(false);

    self.newModalFinishedAnimating = function() {
        self.newSkillFieldHasFocus(true);
    };

    self.newModalFinishedClosing = function() {
        self.newModalOpen(false);
    };

    //Manipulating skills

    self.addSkill = async () => {
        var skill = self.blankSkill();
        skill.coreUuid(CoreManager.activeCore().uuid());
        // TODO: NEED TO FIX THIS
        skill.abilityScore('8761d2db-c176-44e1-8593-69cce2d95d81');
        const newSkill = await skill.ps.create();
        self.skills.push(newSkill.object);
        self.blankSkill(new Skill());
    };

    self.removeSkill = async (skill) => {
        await skill.ps.delete();
        self.skills.remove(skill);
    };

    self.editSkill = function(skill) {
        self.editItemIndex = skill.uuid;
        self.currentEditItem(new Skill());
        self.currentEditItem().importValues(skill.exportValues());
        self.currentEditItem().bonusLabel(skill.bonusLabel());
        self.currentEditItem().proficiency.subscribe(() => {
            self.currentEditItem().updateBonuses();
        });
        self.currentEditItem().modifier.subscribe(() => {
            self.currentEditItem().updateBonuses();
        });
        self.editModalOpen(true);
    };

    self.perceptionHasChanged = function() {
        Notifications.skills.perception.changed.dispatch();
    };
}

ko.components.register('skills', {
    viewModel: SkillsViewModel,
    template: template
});

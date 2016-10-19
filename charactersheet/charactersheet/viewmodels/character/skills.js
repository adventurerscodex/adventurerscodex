'use strict';

function SkillsViewModel() {
    var self = this;

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc'},
        'name desc': { field: 'name', direction: 'desc'},
        'modifier asc': { field: 'modifier', direction: 'asc'},
        'modifier desc': { field: 'modifier', direction: 'desc'},
        'proficiency asc': { field: 'proficiency', direction: 'asc', booleanType: true},
        'proficiency desc': { field: 'proficiency', direction: 'desc', booleanType: true}
    };

    self._defaultSkills = function() {
        var skills = [
            { name: 'Acrobatics', abilityScore: 'Dex', proficency: false, modifier: null, proficiencyType: 'not'},
            { name: 'Animal Handling', abilityScore: 'Wis', proficency: false, modifier: null, proficiencyType: 'not'},
            { name: 'Arcana', abilityScore: 'Int', proficency: false, modifier: null, proficiencyType: 'not' },
            { name: 'Athletics', abilityScore: 'Str', proficency: false, modifier: null, proficiencyType: 'not'},
            { name: 'Deception', abilityScore: 'Cha', proficency: false, modifier: null, proficiencyType: 'not'},
            { name: 'History', abilityScore: 'Int', proficency: false, modifier: null, proficiencyType: 'not'},
            { name: 'Insight', abilityScore: 'Wis', proficency: false, modifier: null, proficiencyType: 'not'},
            { name: 'Intimidation', abilityScore: 'Cha', proficency: false, modifier: null, proficiencyType: 'not'},
            { name: 'Investigation', abilityScore: 'Int', proficency: false, modifier: null, proficiencyType: 'not'},
            { name: 'Medicine', abilityScore: 'Wis', proficency: false, modifier: null, proficiencyType: 'not'},
            { name: 'Nature', abilityScore: 'Int', proficency: false, modifier: null, proficiencyType: 'not'},
            { name: 'Perception', abilityScore: 'Wis', proficency: false, modifier: null, proficiencyType: 'not'},
            { name: 'Performance', abilityScore: 'Cha', proficency: false, modifier: null, proficiencyType: 'not'},
            { name: 'Persuasion', abilityScore: 'Cha', proficency: false, modifier: null, proficiencyType: 'not'},
            { name: 'Religion', abilityScore: 'Int', proficency: false, modifier: null, proficiencyType: 'not'},
            { name: 'Sleight of Hand', abilityScore: 'Dex', proficency: false, modifier: null, proficiencyType: 'not'},
            { name: 'Stealth', abilityScore: 'Dex', proficency: false, modifier: null, proficiencyType: 'not'},
            { name: 'Survival', abilityScore: 'Wis', proficency: false, modifier: null, proficiencyType: 'not'}
        ];
        return skills.map(function(e, i, _) {
            var skill = new Skill(self);
            e.characterId = CharacterManager.activeCharacter().key();
            skill.importValues(e);
            return skill;
        });
    };

    self.selecteditem = ko.observable();
    self.blankSkill = ko.observable(new Skill(self));
    self.skills = ko.observableArray([]);
    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['name asc']);

    self.init = function() {
        Notifications.global.save.add(function() {
            self.skills().forEach(function(e, i, _) {
                e.save();
            });
        });
    };

    self.load = function() {
        var skills = Skill.findAllBy(CharacterManager.activeCharacter().key());

        if (skills.length === 0) {
            self.skills(self._defaultSkills());
            self.skills().forEach(function(e, i, _) {
                e.save();
            });
        } else {
            self.skills(skills);
        }

        //Subscriptions
        Notifications.abilityScores.changed.add(self.dataHasChanged);
        Notifications.stats.changed.add(self.dataHasChanged);
        Notifications.profile.changed.add(self.dataHasChanged);
        self.skills().forEach(function(e, i, _) {
            self.addNotifiers(e);
        });
    };

    self.unload = function() {
        self.skills().forEach(function(e, i, _) {
            e.save();
        });
        self.skills([]);
        Notifications.abilityScores.changed.remove(self.dataHasChanged);
        Notifications.stats.changed.remove(self.dataHasChanged);
        Notifications.profile.changed.remove(self.dataHasChanged);
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

    // Modal Methods

    self.modifierHasFocus = ko.observable(false);

    self.modalFinishedAnimating = function() {
        self.modifierHasFocus(true);
    };

    //Manipulating skills

    self.addSkill = function() {
        var skill = self.blankSkill();
        skill.characterId(CharacterManager.activeCharacter().key());
        skill.save();
        self.addNotifiers(skill);
        self.skills.push(skill);
        self.blankSkill(new Skill());
    };

    self.removeSkill = function(skill) {
        self.skills.remove(skill);
        skill.delete();
    };

    self.editSkill = function(skill) {
        self.selecteditem(skill);
    };

    self.clear = function() {
        self.skills().forEach(function(e, i, _) {
            self.removeSkill(e);
        });
    };

    /**
     * Given a skill, tell it to alert the Notifications of changes to itself.
     */
    self.addNotifiers = function(skill) {
        var savefn = function() {
            skill.save();
            Notifications.skills.changed.dispatch();
        };
        skill.name.subscribe(savefn);
        skill.bonus.subscribe(savefn);
    };

    self.dataHasChanged = function() {
        self.skills().forEach(function(e, i, _) {
            e.updateValues();
        });
    };
}

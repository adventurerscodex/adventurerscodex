'use strict';

/**
 * Converts the values of skill proficiency from a boolean
 * to a set of enumerated strings based on their boolean value.
 */
var migration_110_1_skills = {
    name: 'Skills Proficiency Value Migration',
    version: '1.1.0',
    migration: function() {
        var skills = PersistenceService.findAllObjs('Skill');
        for (var i in skills) {
            var id = skills[i].id;
            var skill = skills[i].data;

            if (skill.proficiency) {
                skill.proficiency = 'proficient';
            } else {
                skill.proficiency = 'not';
            }
            PersistenceService.saveObj('Skill', id, skill);
        }
    }
};

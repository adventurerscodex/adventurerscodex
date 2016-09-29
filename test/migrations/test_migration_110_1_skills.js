'use strict';
/*eslint no-console:0 */

describe('110 Skills Migration', function() {
    describe('Migration', function() {
        it('should change all values of proficiency from true/false to prof enum', function() {
            simple.mock(PersistenceService, 'findAllObjs').returnWith(skillDataFixture);
            var saveObj = simple.mock(PersistenceService, 'saveObj').callFn(function(key, id, skill) {
                key.should.equal('Skill');
                if (skillDataFixture[id].data.proficiency === 'proficient') {
                    skill.proficiency.should.equal('proficient');
                } else {
                    skill.proficiency.should.equal('not');
                }
            });

            migration_110_1_skills.migration();
            saveObj.callCount.should.equal(2);
        });
    });
});

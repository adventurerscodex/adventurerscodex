import {
    CharacterManager,
    Notifications
} from 'charactersheet/utilities';
import {
    PersistenceService,
    SortService
} from 'charactersheet/services/common';
import { MockCharacterManager } from '../mocks';
import { Skill } from 'charactersheet/models/character';
import { SkillsViewModel } from 'charactersheet/viewmodels/character/skills';
import Should from 'should';
import simple from 'simple-mock';

describe('Skill Tree', function() {
    var delShim = function() {};

    describe('Add skill', function() {
        it('should add a new skill to the list of skills', function() {
            var c = CharacterManager.activeCharacter;
            CharacterManager.activeCharacter = function() {
                return {
                    key: function() { return '1234'; }
                };
            };

            var p = new SkillsViewModel();
            p.skills().length.should.equal(0);
            p.addSkill();
            p.skills().length.should.equal(1);

            CharacterManager.activeCharacter = c;
        });
    });

    describe('Remove skill', function() {
        it('should remove a skill from the list of skills', function() {
            var c = CharacterManager.activeCharacter;
            CharacterManager.activeCharacter = function() {
                return {
                    key: function() { return '1234'; }
                };
            };

            var p = new SkillsViewModel();
            p.skills().length.should.equal(0);
            p.blankSkill().delete = delShim;
            p.addSkill();
            p.skills().length.should.equal(1);
            p.removeSkill(p.skills().pop());
            p.skills().length.should.equal(0);

            CharacterManager.activeCharacter = c;
        });
    });

    describe('Edit skill', function() {
        it('should put a skill from the list of skills into the selected slot', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var p = new SkillsViewModel();

            var skill = new Skill();
            skill.name('Tree climbing');
            p.editSkill(skill);
            p.currentEditItem().name().should.equal(skill.name());
            p.editModalOpen().should.equal(true);
        });
    });

    describe('Sort By', function() {
        it('should sort the list of skills by given criteria', function() {
            var p = new SkillsViewModel();
            p.sortBy('name');
            p.sort().should.equal(p.sorts['name desc']);
            p.sortBy('name');
            p.sort().should.equal(p.sorts['name asc']);
            p.sortBy('modifier');
            p.sort().should.equal(p.sorts['modifier asc']);
            p.sortBy('modifier');
            p.sort().should.equal(p.sorts['modifier desc']);
        });
    });

    describe('Sort Arrow', function() {
        it('should sort the list of skills by given criteria', function() {
            var p = new SkillsViewModel();
            p.sortBy('name');
            p.sort().should.equal(p.sorts['name desc']);
            p.sortArrow('name').should.equal('fa fa-arrow-down fa-color');
            p.sortArrow('modifier').should.equal('');
            p.sortBy('name');
            p.sort().should.equal(p.sorts['name asc']);
            p.sortArrow('name').should.equal('fa fa-arrow-up fa-color');
            p.sortArrow('modifier').should.equal('');
        });
    });

    describe('Clear', function() {
        it('should clear all the values in skills.', function() {
            var p = new SkillsViewModel();
            var skills = [new Skill()];
            skills[0].delete = delShim;
            p.skills(skills);
            p.skills().should.equal(skills);
            p.clear();
            p.skills().length.should.equal(0);
        });
    });
});

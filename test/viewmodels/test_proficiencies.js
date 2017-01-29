'use strict';

describe('Proficiency Tree', function() {
    var delShim = function() {};

    describe('Add skill', function() {
        it('should add a new skill to the list of proficiencies', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var p = new ProficienciesViewModel();
            p.proficiencies().length.should.equal(0);
            p.addProficiency();
            p.proficiencies().length.should.equal(1);
        });
    });

    describe('Remove skill', function() {
        it('should remove a skill from the list of proficiencies', function() {
            var c = CharacterManager.activeCharacter;
            CharacterManager.activeCharacter = function() {
                return {
                    key: function() { return '1234'; }
                };
            };

            var p = new ProficienciesViewModel();
            p.proficiencies().length.should.equal(0);
            p.blankSkill().delete = delShim;
            p.addProficiency();
            p.proficiencies().length.should.equal(1);
            p.removeSkill(p.proficiencies().pop());
            p.proficiencies().length.should.equal(0);

            CharacterManager.activeCharacter = c;
        });
    });

    describe('Edit skill', function() {
        it('should put a skill from the list of proficiencies into the selected slot', function() {
            var c = CharacterManager.activeCharacter;
            CharacterManager.activeCharacter = function() {
                return {
                    key: function() { return '1234'; }
                };
            };

            var p = new ProficienciesViewModel();
            p.addProficiency();
            Should.not.exist(p.selecteditem());
            p.proficiencies().length.should.equal(1);
            p.editSkill(p.proficiencies()[0]);
            p.selecteditem().should.equal(p.proficiencies.pop());

            CharacterManager.activeCharacter = c;
        });
    });

    describe('Sort By', function() {
        it('should sort the list of proficiencies by given criteria', function() {
            var p = new ProficienciesViewModel();
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
        it('should sort the list of proficiencies by given criteria', function() {
            var p = new ProficienciesViewModel();
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
        it('should clear all the values in proficiencies.', function() {
            var p = new ProficienciesViewModel();
            var proficiencies = [new Proficiency()];
            proficiencies[0].delete = delShim;
            p.proficiencies(proficiencies);
            p.proficiencies().should.equal(proficiencies);
            p.clear();
            p.proficiencies().length.should.equal(0);
        });
    });
});

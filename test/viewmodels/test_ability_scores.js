'use strict';

import Should from 'should'
import simple from 'simple-mock'

import { AbilityScores } from 'charactersheet/models/character'
import { AbilityScoresViewModel } from 'charactersheet/viewmodels/character/ability_scores'
import { CharacterManager } from 'charactersheet/utilities'
import { Notifications } from 'charactersheet/utilities'
import { PersistenceService } from 'charactersheet/services/common'

describe('AbilityScoresViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Load', function() {
        it('should load values from db', function() {
            var scores = new AbilityScores();
            simple.mock(PersistenceService, 'findBy').returnWith([scores]);
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            scores.con(5);

            var asVM = new AbilityScoresViewModel();
            asVM.load();
            asVM.abilityScores().con().should.equal(5);
        });

        it('should not load values from database.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            simple.mock(PersistenceService, 'findBy').returnWith([]);
            var asVM = new AbilityScoresViewModel();

            asVM.load();
            asVM.abilityScores().characterId().should.equal('1234');
        });
    });

    describe('Unload', function() {
        it('should save values to the database', function() {
            var asVM = new AbilityScoresViewModel();
            var notifySpy = simple.mock(asVM.abilityScores(), 'save');

            asVM.unload();

            notifySpy.called.should.equal(true);
        });
    });

    describe('DataHasChanged', function() {
        it('should update subscribed modules', function() {
            var asVM = new AbilityScoresViewModel();
            var notifySpy = simple.mock(asVM.abilityScores(), 'save');
            var notifySpy2 = simple.mock(Notifications.abilityScores.changed, 'dispatch');

            asVM.dataHasChanged();

            notifySpy.called.should.equal(true);
            notifySpy2.called.should.equal(true);
        });
    });

    describe('isNumeric', function() {
        it('checks if input is a number', function() {
            var falseResponse = isNumeric('a');

            var trueResponse  = isNumeric(15);

            falseResponse.should.equal(false);
            trueResponse.should.equal(true);
        });
    });

    describe('getModifier', function() {
        it('returns ability score modifier', function() {
            var successMod = getModifier(20);

            var failureMod = getModifier('a');

            successMod.should.equal(5);
            Should.not.exist(failureMod);
        });
    });

    describe('getStrModifier', function() {
        it('returns str modifier', function() {
            var blankString = getStrModifier(null);
            var positiveValue = getStrModifier(20);
            var negativeValue = getStrModifier(-5);

            positiveValue.should.equal('+ 5');
            negativeValue.should.equal('- 8');
            blankString.should.equal('');
        });
    });
});

'use strict';

describe('AbilityScoresViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Init', function() {
        it('should init the module', function() {
            var asVM = new AbilityScoresViewModel();
            asVM.init();
        });
    });

    describe('Load', function() {
        it('should load values from db', function() {
            var scores = new AbilityScores();
            simple.mock(AbilityScores, 'findBy').returnWith([scores]);
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            scores.con(5);

            var asVM = new AbilityScoresViewModel();
            asVM.load();
            asVM.abilityScores().con().should.equal(5);
        });

        it('should not load values from database.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            simple.mock(AbilityScores, 'findBy').returnWith([]);
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
});

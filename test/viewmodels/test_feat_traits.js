'use strict';

describe('FeaturesTraitsViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Load', function() {
        it('should load values from db', function() {
            var feat = new FeaturesTraits();
            simple.mock(PersistenceService, 'findBy').returnWith([feat]);
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var featsVM = new FeaturesTraitsViewModel();
            feat.ideals('test');

            featsVM.load();
            featsVM.featTraits().ideals().should.equal('test');
        });

        it('should not load values from database.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            simple.mock(PersistenceService, 'findBy').returnWith([]);
            var featsVM = new FeaturesTraitsViewModel();

            featsVM.load();
            featsVM.featTraits().characterId().should.equal('1234');
        });
    });

    describe('Unload', function() {
        it('should save values to the database', function() {
            var featsVM = new FeaturesTraitsViewModel();
            var notifySpy = simple.mock(featsVM.featTraits(), 'save');

            featsVM.unload();

            notifySpy.called.should.equal(true);
        });
    });
});

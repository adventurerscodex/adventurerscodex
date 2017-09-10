import simple from 'simple-mock'

import { AppearanceViewModel } from 'charactersheet/viewmodels/character/appearance'
import { CharacterAppearance } from 'charactersheet/models/character'
import { CharacterManager, Notifications } from 'charactersheet/utilities'
import { PersistenceService } from 'charactersheet/services/common'

describe('Appearance', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Load', function() {
        it('should load values from database', function() {
            var app = new CharacterAppearance();
            app.height('6ft');
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            simple.mock(PersistenceService, 'findBy').returnWith([app]);
            var a = new AppearanceViewModel();

            app.height('6ft');

            a.load();
            a.appearance().height().should.equal('6ft');
        });

        it('should not load values from database', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            simple.mock(PersistenceService, 'findBy').returnWith([]);
            var a = new AppearanceViewModel();

            a.load();
            a.appearance().characterId().should.equal('1234');
        });
    });

    describe('Unload', function() {
        it('should save values to the database', function() {
            var app = new AppearanceViewModel();
            var notifySpy = simple.mock(app.appearance(), 'save');

            app.unload();

            notifySpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear the values of the model', function() {
            var a   = new AppearanceViewModel();
            var notifySpy = simple.mock(a.appearance(), 'clear');

            a.clear();

            notifySpy.called.should.equal(true);
        });
    });
});

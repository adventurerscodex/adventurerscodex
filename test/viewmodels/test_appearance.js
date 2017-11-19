import {
    CharacterManager,
    Notifications
} from 'charactersheet/utilities';
import { AppearanceViewModel } from 'charactersheet/viewmodels/character/appearance';
import { CharacterAppearance } from 'charactersheet/models/character';
import { MockCharacterManager } from '../mocks';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import should from 'Should';
import simple from 'simple-mock';

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
            a.appearance().characterId().should.equal('12345');
        });
    });

    describe('Clear', function() {
        it('should clear the values of the model', function() {
            var a = new AppearanceViewModel();
            var notifySpy = simple.mock(a.appearance(), 'clear');

            a.clear();

            notifySpy.called.should.equal(true);
        });
    });
});

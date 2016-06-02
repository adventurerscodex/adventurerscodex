'use strict';

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
            simple.mock(CharacterAppearance, 'findKey').returnWith([app]);
            var a = new AppearanceViewModel();

            a.appearance.height.should.equal('');
            a.load();
            a.appearance.height.should.equal('6ft');
        });
    });

    describe('Unload', function() {
        it('should save values to the database', function() {
            var app = new AppearanceViewModel();

            var notifySpy = simple.mock(self.appearance, 'save');

            app.unload();
            notifySpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear values of the model', function() {
            var app = new CharacterAppearance();
            var a   = new AppearanceViewModel();
            app.height('6ft');
            a.appearance(app);

            a.clear();

            a.appearance.height.should.equal('');
        });
    });
});

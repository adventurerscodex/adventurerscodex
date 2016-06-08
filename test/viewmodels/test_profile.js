'use strict';

describe('Profile View Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Clear', function() {
        it('should clear all the values in profile', function() {
            var p = new ProfileViewModel();
            p.profile().characterName('Bob');
            p.profile().characterName().should.equal('Bob');
            p.clear();
            p.profile().characterName().should.equal('');
        });
    });

    describe('Init', function() {
        it('should init the module', function() {
            var pVM = new ProfileViewModel();
            pVM.init();
        });
    });

    describe('Load', function() {
        it('should load values from db', function() {
            var p = new Profile();
            simple.mock(Profile, 'findBy').returnWith([p]);
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var pVM = new ProfileViewModel();
            p.characterName('test');

            pVM.load();
            pVM.profile().characterName().should.equal('test');
        });

        it('should not load values from database.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            simple.mock(Profile, 'findBy').returnWith([]);
            var pVM = new ProfileViewModel();

            pVM.load();
            pVM.profile().characterId().should.equal('1234');
        });
    });

    describe('Unload', function() {
        it('should save values to the database', function() {
            var pVM = new ProfileViewModel();
            var notifySpy = simple.mock(pVM.profile(), 'save');

            pVM.unload();

            notifySpy.called.should.equal(true);
        });
    });

    describe('DataHasChanged', function() {
        it('should update subscribed modules', function() {
            var pVM = new ProfileViewModel();
            var notifySpy = simple.mock(pVM.profile(), 'save');
            var notifySpy2 = simple.mock(Notifications.profile.changed, 'dispatch');

            pVM.dataHasChanged();

            notifySpy.called.should.equal(true);
            notifySpy2.called.should.equal(true);
        });
    });
});

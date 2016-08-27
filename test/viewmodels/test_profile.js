'use strict';

describe('Profile View Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Clear', function() {
        it('should clear all the values in profile', function() {
            var p = new ProfileViewModel();
            p.characterName('Bob');
            p.characterName().should.equal('Bob');
            p.clear();
            p.characterName().should.equal('');
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
            pVM.characterName().should.equal('test');
        });
    });

    describe('DataHasChanged', function() {
        it('should update subscribed modules', function() {
            var pVM = new ProfileViewModel();
            var notifySpy2 = simple.mock(Notifications.profile.changed, 'dispatch');
            var p = new Profile();
            simple.mock(Profile, 'findBy').returnWith([p]);
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            
            pVM.dataHasChanged();

            notifySpy2.called.should.equal(true);
        });
    });
});

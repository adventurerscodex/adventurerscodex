'use strict';

describe('PlayerInfoViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Init', function() {
        it('should init the module', function() {
            var piVM = new PlayerInfoViewModel();
            piVM.init();
        });
    });

    describe('Load', function() {
        it('should load values from db', function() {
            var pi = new PlayerInfo();
            simple.mock(PlayerInfo, 'findBy').returnWith([pi]);
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var piVM = new PlayerInfoViewModel();
            pi.email('test');

            piVM.load();
            piVM.playerInfo().email().should.equal('test');
        });

        it('should not load values from database.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            simple.mock(PlayerInfo, 'findBy').returnWith([]);
            var piVM = new PlayerInfoViewModel();

            piVM.load();
            piVM.playerInfo().characterId().should.equal('1234');
        });
    });

    describe('Unload', function() {
        it('should save values to the database', function() {
            var piVM = new PlayerInfoViewModel();
            var notifySpy = simple.mock(piVM.playerInfo(), 'save');

            piVM.unload();

            notifySpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear values', function() {
            var piVM = new PlayerInfoViewModel();
            var pi = new PlayerInfo();
            pi.email('test');
            piVM.playerInfo(pi);

            piVM.clear();

            piVM.playerInfo().email().should.equal('');
        });
    });

    describe('DataHasChanged', function() {
        it('should update subscribed modules', function() {
            var piVM = new PlayerInfoViewModel();
            var notifySpy = simple.mock(piVM.playerInfo(), 'save');
            var notifySpy2 = simple.mock(Notifications.playerInfo.changed, 'dispatch');

            piVM.dataHasChanged();

            notifySpy.called.should.equal(true);
            notifySpy2.called.should.equal(true);
        });
    });
});

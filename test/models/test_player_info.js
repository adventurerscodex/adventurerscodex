'use strict';

describe('Player Info Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Instance Methods', function() {
        describe('Clear', function() {
            it('should clear all the data', function() {
                var pi = new PlayerInfo();
                pi.email(PlayerInfoFixture.email);
                pi.email().should.equal(PlayerInfoFixture.email);
                pi.clear();
                pi.email().should.equal('');
            });
        });

        describe('Import', function() {
            it('should import an object with all the info supplied.', function() {
                var pi = new PlayerInfo();
                pi.importValues(PlayerInfoFixture);
                pi.email().should.equal(PlayerInfoFixture.email);
                pi.characterId().should.equal(PlayerInfoFixture.characterId);
            });
        });

        describe('Export', function() {
            it('should yield an object with all the info supplied.', function() {
                var pi = new PlayerInfo();
                pi.importValues(PlayerInfoFixture);
                var values = pi.exportValues();

                pi.characterId().should.equal(values.characterId);
                pi.email().should.equal(values.email);
            });
        });

        describe('Gravatar URL', function() {
            it('should return a gravatar URL for the person\'s email', function() {
                var pi = new PlayerInfo();
                pi.importValues(PlayerInfoFixture);

                //Pass
                pi.gravatarUrl().should.equal(PlayerInfoFixture.gravatarUrl);

                //Fail
                pi.email(null);
                pi.gravatarUrl().should.equal('');
            });
        });

        describe('Save', function() {
            it('should call the token save.', function() {
                var pi = new PlayerInfo();
                var spy = simple.mock(pi.ps, 'save');
                pi.save();
                spy.called.should.equal(true);
            });
        });
    });
    describe('Find By', function() {
        it('Should return a list of image models matching the given id.', function() {
            //Empty
            simple.mock(PersistenceService, 'findBy').returnWith([new PlayerInfo()]);
            PlayerInfo.findBy('someid').length.should.equal(0);

            //Filled
            simple.mock(PersistenceService, 'findAll').returnWith([new PlayerInfo(), new PlayerInfo()].map(function(e, i, _) {
                e.characterId('someid');
                return e;
            }));
            PlayerInfo.findBy('someid').length.should.equal(2);

        });
    });
});

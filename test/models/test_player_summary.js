'use strict';

describe('Player Summary Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Clear', function() {
        it('should clear the values.', function() {
            var ft = new PlayerSummary();
            ft.playerName('Bob');
            ft.playerName().should.equal('Bob');
            ft.clear();
            ft.playerName().should.equal('');
        });
    });

    describe('Import', function() {
        it('should import the values.', function() {
            var ft = new PlayerSummary();
            var e = {
                playerName: 'Bob'
            };
            ft.playerName().should.equal('');
            ft.importValues(e);
            ft.playerName().should.equal(e.playerName);
        });
    });

    describe('Export', function() {
        it('should export the values.', function() {
            var ft = new PlayerSummary();
            ft.playerName('Bob');
            ft.playerName().should.equal('Bob');
            var e = ft.exportValues();
            ft.playerName().should.equal(e.playerName);
        });
    });

    describe('Find By', function() {
        it('should return a given player summary given a key.', function() {
            var sum = new PlayerSummary();
            sum.importValues(PlayerSummaryFixture);
            simple.mock(PlayerSummary, 'fromKey').returnWith(sum);

            var result = PlayerSummary.findBy(CharacterFixture.key);
            result.playerName().should.equal(PlayerSummaryFixture.playerName);
        });
    });

    describe('FromKey', function() {
        beforeEach(function() {
            var cha = new Character();
            cha.importValues(CharacterFixture);
            var pro = new Profile();
            pro.importValues(ProfileFixture);
            var hea = new Health();
            hea.importValues(HealthFixture);
            var sta = new OtherStats();
            sta.importValues(OtherStatsFixture);

            simple.mock(Character, 'findBy').returnWith([cha]);
            simple.mock(Profile, 'findBy').returnWith([pro]);
            simple.mock(Health, 'findBy').returnWith([hea]);
            simple.mock(OtherStats, 'findBy').returnWith([sta]);
        });
        describe('Test ImageModel branch', function() {
            it('should return a summary with data from the character', function() {
                var ima = new ImageModel();
                ima.importValues(ImageFixture);
                simple.mock(ImageModel, 'findBy').returnWith([ima]);

                var summ = PlayerSummary.fromKey(CharacterFixture.key);
                summ.playerName().should.equal(ProfileFixture.playerName);

                summ.profileImage().should.equal(ImageFixture.imageUrl);
            });
        });
        describe('Test Gravatar Image branch', function() {
            it('should return a summary with data from the character', function() {
                var info = new PlayerInfo();
                info.importValues(PlayerInfoFixture);
                simple.mock(PlayerInfo, 'findBy').returnWith([info]);

                var summ = PlayerSummary.fromKey(CharacterFixture.key);
                summ.playerName().should.equal(ProfileFixture.playerName);

                summ.profileImage().should.equal(info.gravatarUrl());
            });
        });
        describe('Test Campaign branch', function() {
            it('should return a summary with data from the character', function() {
                var cha = new Character();
                cha.importValues(DMCharacterFixture);
                simple.mock(Character, 'findBy').returnWith([cha]);

                var cam = new Campaign();
                cam.importValues(CampaignFixture);
                simple.mock(Campaign, 'findBy').returnWith([cam]);

                var ima = new ImageModel();
                ima.importValues(ImageFixture);
                simple.mock(ImageModel, 'findBy').returnWith([ima]);

                var summ = PlayerSummary.fromKey(CharacterFixture.key);
                summ.playerName().should.equal(CampaignFixture.dmName);
            });
        });
    });
});

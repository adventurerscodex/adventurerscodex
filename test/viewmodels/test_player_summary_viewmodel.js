"use strict";

describe('Player Summary View Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Instance Methods', function() {
        describe('Load', function() {
            it('should subscribe to playerSummary notifications.', function() {
                var summ = new PlayerSummaryViewModel();

                var notifySpy = simple.mock(Notifications.playerSummary.changed, 'add');
                summ.load();

                notifySpy.called.should.equal(true);
            });
        });
        describe('Data Has Changed', function() {
            it('should reload it\'s data from the PlayerSummaryService.', function() {
                var summ = new PlayerSummaryViewModel();
                playerSummaryService = new PlayerSummaryService();
                simple.mock(playerSummaryService, 'playerSummaries', [new PlayerSummary()]);

                summ.playerSummaries().length.should.equal(0);
                summ.dataHasChanged();
                summ.playerSummaries().length.should.equal(1);
            });
        });
    });
});

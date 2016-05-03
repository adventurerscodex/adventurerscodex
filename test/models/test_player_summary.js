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
});

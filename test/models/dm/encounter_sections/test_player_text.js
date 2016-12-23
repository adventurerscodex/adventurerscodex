'use strict';

describe('PlayerText', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('_formatStringToLength ', function() {
        it('should return a truncated string', function() {
            var playerText = new PlayerText();

            var string = playerText._formatStringToLength('blah', 2);
            string.should.equal('bl...');
        });
        it('should return the string', function() {
            var playerText = new PlayerText();

            var string = playerText._formatStringToLength('blah', 5);
            string.should.equal('blah');
        });
    });

    describe('shortDescription', function() {
        it('should return short description', function() {
            var playerText = new PlayerText();
            playerText.description('blah');
            simple.mock(Utility.markdown, 'asPlaintext').returnWith('blah');

            var description = playerText.shortDescription();
            description.should.equal('blah');
        });
        it('should return nothing', function() {
            var playerText = new PlayerText();

            var description = playerText.shortDescription();
            description.should.equal('');
        });
    });

    describe('longDescription', function() {
        it('should return long description', function() {
            var playerText = new PlayerText();
            playerText.description('blah');
            simple.mock(Utility.markdown, 'asPlaintext').returnWith('blah');

            var description = playerText.longDescription();
            description.should.equal('blah');
        });
        it('should return nothing', function() {
            var playerText = new PlayerText();

            var description = playerText.longDescription();
            description.should.equal('');
        });
    });

    describe('Save', function() {
        it('should save playerText', function() {
            var playerText = new PlayerText();
            var playerTextSpy = simple.mock(playerText.ps, 'save');

            playerText.save();
            playerTextSpy.called.should.equal(true);
        });
    });

    describe('Delete', function() {
        it('should delete playerText', function() {
            var playerText = new PlayerText();
            var playerTextSpy = simple.mock(playerText.ps, 'delete');

            playerText.delete();
            playerTextSpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear playerText', function() {
            var playerText = new PlayerText();
            playerText.description('blah');

            playerText.description().should.equal('blah');
            playerText.clear();
            Should.not.exist(playerText.description());
        });
    });

    describe('Import', function() {
        it('should import playerText', function() {
            var playerText = new PlayerText();

            Should.not.exist(playerText.description());
            playerText.importValues({"description": 'blah'});
            playerText.description().should.equal('blah');
        });
    });

    describe('Export', function() {
        it('should export playerText', function() {
            var playerText = new PlayerText();
            playerText.description('blah');

            playerText.description().should.equal('blah');
            var exported = playerText.exportValues();
            exported.description.should.equal('blah');
        });
    });
});

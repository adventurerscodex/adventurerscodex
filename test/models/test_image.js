'use strict';

describe('Image Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Instance Methods', function() {
        describe('Clear', function() {
            it('should clear all the image data', function() {
                var image = new ImageModel();
                image.imageUrl(ImageFixture.dataUrl);
                image.imageUrl().should.equal(ImageFixture.dataUrl);
                image.clear();
                image.imageUrl().should.equal('');
            });
        });

        describe('Has Data', function() {
            it('should return whether or not the model contains data.', function() {
                var image = new ImageModel();
                image.hasData().should.equal(false);
                image.imageUrl(ImageFixture.dataUrl);
                image.hasData().should.equal(true);
            });
        });

        describe('Import', function() {
            it('should import an object with all the info supplied.', function() {
                var image = new ImageModel();
                image.importValues(ImageFixture);
                image.imageUrl().should.equal(ImageFixture.imageUrl);
                image.characterId().should.equal(ImageFixture.characterId);
            });
        });

        describe('Export', function() {
            it('should yield an object with all the info supplied.', function() {
                var image = new ImageModel();
                image.importValues(ImageFixture);
                var values = image.exportValues();

                image.characterId().should.equal(values.characterId);
                image.imageUrl().should.equal(values.imageUrl);
            });
        });
    });
});

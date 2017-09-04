'use strict';

import simple from 'simple-mock'

import { Feature } from 'charactersheet/models/character/feature'

describe('Feature Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Save', function() {
        it('should save the values.', function() {
            var feature = new Feature();
            var saveSpy = simple.mock(feature.ps, 'save');

            saveSpy.called.should.equal(false);
            feature.save();
            saveSpy.called.should.equal(true);
        });
    });

    describe('Delete', function() {
        it('should save the values.', function() {
            var feature = new Feature();
            var deleteSpy = simple.mock(feature.ps, 'delete');

            deleteSpy.called.should.equal(false);
            feature.delete();
            deleteSpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear the values.', function() {
            var feature = new Feature();
            feature.name('something something');
            feature.name().should.equal('something something');
            feature.clear();
            feature.name().should.equal('');
        });
    });

    describe('Import', function() {
        it('should import the values.', function() {
            var feature = new Feature();
            var values = {
                name: 'something something'
            };
            feature.name().should.equal('');
            feature.importValues(values);
            feature.name().should.equal(values.name);
        });
    });

    describe('Export', function() {
        it('should export the values.', function() {
            var feature = new Feature();
            feature.name('something something');
            feature.name().should.equal('something something');
            var values = feature.exportValues();
            feature.name().should.equal(values.name);
        });
    });
});

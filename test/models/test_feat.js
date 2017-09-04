'use strict';

import { simple } from 'simple-mock'

import { feat } from 'charactersheet/models/character/feat'


describe('Feat Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Save', function() {
        it('should save the values.', function() {
            var feat = new Feat();
            var saveSpy = simple.mock(feat.ps, 'save');

            saveSpy.called.should.equal(false);
            feat.save();
            saveSpy.called.should.equal(true);
        });
    });

    describe('Delete', function() {
        it('should save the values.', function() {
            var feat = new Feat();
            var deleteSpy = simple.mock(feat.ps, 'delete');

            deleteSpy.called.should.equal(false);
            feat.delete();
            deleteSpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear the values.', function() {
            var feat = new Feat();
            feat.name('something something');
            feat.name().should.equal('something something');
            feat.clear();
            feat.name().should.equal('');
        });
    });

    describe('Import', function() {
        it('should import the values.', function() {
            var feat = new Feat();
            var values = {
                name: 'something something'
            };
            feat.name().should.equal('');
            feat.importValues(values);
            feat.name().should.equal(values.name);
        });
    });

    describe('Export', function() {
        it('should export the values.', function() {
            var feat = new Feat();
            feat.name('something something');
            feat.name().should.equal('something something');
            var values = feat.exportValues();
            feat.name().should.equal(values.name);
        });
    });
});

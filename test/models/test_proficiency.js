import { Proficiency } from 'charactersheet/models/character/proficiency';
import simple from 'simple-mock';

describe('Proficiency Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Save', function() {
        it('should save the values.', function() {
            var proficiency = new Proficiency();
            var saveSpy = simple.mock(proficiency.ps, 'save');

            saveSpy.called.should.equal(false);
            proficiency.save();
            saveSpy.called.should.equal(true);
        });
    });

    describe('Delete', function() {
        it('should save the values.', function() {
            var proficiency = new Proficiency();
            var deleteSpy = simple.mock(proficiency.ps, 'delete', function() {});

            deleteSpy.called.should.equal(false);
            proficiency.delete();
            deleteSpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear the values.', function() {
            var proficiency = new Proficiency();
            proficiency.name('something something');
            proficiency.name().should.equal('something something');
            proficiency.clear();
            proficiency.name().should.equal('');
        });
    });

    describe('Import', function() {
        it('should import the values.', function() {
            var proficiency = new Proficiency();
            var values = {
                name: 'something something'
            };
            proficiency.name().should.equal('');
            proficiency.importValues(values);
            proficiency.name().should.equal(values.name);
        });
    });

    describe('Export', function() {
        it('should export the values.', function() {
            var proficiency = new Proficiency();
            proficiency.name('something something');
            proficiency.name().should.equal('something something');
            var values = proficiency.exportValues();
            proficiency.name().should.equal(values.name);
        });
    });
});

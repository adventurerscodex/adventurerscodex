import { Trait } from 'charactersheet/models/character/trait';
import simple from 'simple-mock';

describe('Trait Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Save', function() {
        it('should save the values.', function() {
            var trait = new Trait();
            var saveSpy = simple.mock(trait.ps, 'save');

            saveSpy.called.should.equal(false);
            trait.save();
            saveSpy.called.should.equal(true);
        });
    });

    describe('Delete', function() {
        it('should delete the values.', function() {
            var trait = new Trait();
            var deleteSpy = simple.mock(trait.ps, 'delete', function(){});

            deleteSpy.called.should.equal(false);
            trait.delete();
            deleteSpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear the values.', function() {
            var trait = new Trait();
            trait.name('something something');
            trait.name().should.equal('something something');
            trait.clear();
            trait.name().should.equal('');
        });
    });

    describe('Import', function() {
        it('should import the values.', function() {
            var trait = new Trait();
            var values = {
                name: 'something something'
            };
            trait.name().should.equal('');
            trait.importValues(values);
            trait.name().should.equal(values.name);
        });
    });

    describe('Export', function() {
        it('should export the values.', function() {
            var trait = new Trait();
            trait.name('something something');
            trait.name().should.equal('something something');
            var values = trait.exportValues();
            trait.name().should.equal(values.name);
        });
    });
});

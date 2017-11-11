import { Environment } from 'charactersheet/models';
import Should from 'should';
import simple from 'simple-mock';


describe('Environment', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Save', function() {
        it('should save environment', function() {
            var environment = new Environment();
            var environmentSpy = simple.mock(environment.ps, 'save');

            environment.save();
            environmentSpy.called.should.equal(true);
        });
    });

    describe('Delete', function() {
        it('should delete environment', function() {
            var environment = new Environment();
            var environmentSpy = simple.mock(environment.ps, 'delete', function() {});

            environment.delete();
            environmentSpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear environment', function() {
            var environment = new Environment();
            environment.description('blah');

            environment.description().should.equal('blah');
            environment.clear();
            Should.not.exist(environment.description());
        });
    });

    describe('Import', function() {
        it('should import environment', function() {
            var environment = new Environment();

            Should.not.exist(environment.description());
            environment.importValues({'description': 'blah'});
            environment.description().should.equal('blah');
        });
    });

    describe('Export', function() {
        it('should export environment', function() {
            var environment = new Environment();
            environment.description('blah');

            environment.description().should.equal('blah');
            var exported = environment.exportValues();
            exported.description.should.equal('blah');
        });
    });
});

import { MockLocalStorage } from '../fixtures';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import simple from 'simple-mock';

describe('Persistence Service', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Static Methods', function() {
        describe('findAllObjs', function() {
            it('should find all objects given a key', function() {
                simple.mock(PersistenceService, 'storage', MockLocalStorage);

                var key = 'Skill';

                var res = PersistenceService._findAllObjs(key);
                res[0].data.name.should.equal('Acrobatics');
            });
        });
    });
});

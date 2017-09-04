'use strict';
/*eslint no-console:0 */

import simple from 'simple-mock'

import { PersistenceService } from 'charactersheet/services/common'

describe('110 Stats Migration', function() {
    describe('Migration', function() {
        it('should change proficiency to 0', function() {
            simple.mock(PersistenceService, 'findAllObjs').returnWith(statDataFixture);
            var saveObj = simple.mock(PersistenceService, 'saveObj').callFn(function(key, id, stat) {
                key.should.equal('OtherStats');
                stat.proficiency.should.equal(0);
            });

            migration_110_3_stats.migration();
            saveObj.callCount.should.equal(1);
        });
    });
});
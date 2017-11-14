/*eslint no-console:0 */
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import Should from 'should';
import { migration_120_1_weapons } from 'charactersheet/migrations';
import simple from 'simple-mock';
import { weaponDataFixture } from '../fixtures';

describe('120 Weapons Migration', function() {
    describe('Migration', function() {
        it('should change handedness, if light, to blank string', function() {
            simple.mock(PersistenceService, 'findAllObjs').returnWith(weaponDataFixture);
            var saveObj = simple.mock(PersistenceService, 'saveObj').callFn(function(key, id, weapon) {
                key.should.equal('Weapon');
                if (weaponDataFixture[id].data.weaponHandedness === 'Light') {
                    weapon.weaponHandedness.should.equal('');
                } else {
                    weapon.weaponHandedness.should.equal(weaponDataFixture[id].data.weaponHandedness);
                }
            });

            migration_120_1_weapons.migration();
            saveObj.callCount.should.equal(2);
        });
    });
});

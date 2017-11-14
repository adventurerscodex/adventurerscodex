/*eslint no-console:0 */
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import Should from 'should';
import { migration_110_2_spells } from 'charactersheet/migrations';
import simple from 'simple-mock';
import { spellDataFixture } from '../fixtures';

describe('110 Spells Migration', function() {
    describe('Migration', function() {
        it('should change spell values to match SRD', function() {
            simple.mock(PersistenceService, 'findAllObjs').returnWith(spellDataFixture);
            var saveObj = simple.mock(PersistenceService, 'saveObj').callFn(function(key, id, spell) {
                key.should.equal('Spell');
                if (spellDataFixture[id].data.spellType === 'Attack Roll') {
                    spell.proficiency.should.equal('');
                }
                if (spellDataFixture[id].data.spellSchool === 'Cantrip') {
                    spell.proficiency.should.equal('');
                }
                if (spellDataFixture[id].data.spellDuration === '1 min') {
                    spell.proficiency.should.equal('1 minute');
                }
                if (spellDataFixture[id].data.spellRange === '5 ft') {
                    spell.proficiency.should.equal('5 feet');
                }
            });

            migration_110_2_spells.migration();
            saveObj.callCount.should.equal(1);
        });
    });
});

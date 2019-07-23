import { getUniqueScores, migration_152_1_monster_ability_scores } from 'charactersheet/migrations/152_1_monster_ability_score';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import Should from 'should';
import { scoresFixture } from '../fixtures';
import simple from 'simple-mock';

describe('152 Monster Ability Score', () => {
    describe('Get Unique Hashes', () => {
        it('should return a list of scores that are unique', () => {
            const scores = scoresFixture;
            scores.length.should.equal(8);
            const uniqueScores = getUniqueScores(scores);
            uniqueScores.length.should.equal(4);
        });
    });
});

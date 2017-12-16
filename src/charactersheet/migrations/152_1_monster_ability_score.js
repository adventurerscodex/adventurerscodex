import { PersistenceService } from 'charactersheet/services/common/persistence_service';


const SCORE_TABLE_NAME = 'MonsterAbilityScore';


/**
 * Generate a unique hash for any unique ability score. This allows comparison
 * between identical scores in a given monster and encounter.
 */
const hashAbilityScore = (score) => {
    return `${score.characterId}_${score.monsterId}_${score.encounterId}_${score.name}_${score.value}`;
};

const getUniqueScores = (scores) => {
    const scoresAndHashes = scores.map((score, i, _) => {
        return [score.data, hashAbilityScore(score.data)];
    });

    var uniqueScores = [];
    var uniqueHashes = [];
    for (var i=0; i<scoresAndHashes.length; i++) {
        const [score, hash] = scoresAndHashes[i];
        if (uniqueHashes.indexOf(hash) === -1) {
            uniqueHashes.push(hash);
            uniqueScores.push(score);
        }
    }
    return uniqueScores;
};


/**
 * Remove redundant monster ability scores from the encounters.
 */
export var migration_152_1_monster_ability_scores = {
    name: 'Remove redundant monster ability scores.',
    version: '1.5.2',
    migration: () => {
        const scores = PersistenceService.findAllObjs(SCORE_TABLE_NAME);
        const uniqueScores = getUniqueScores(scores);

        // Dump all scores.
        PersistenceService.drop(SCORE_TABLE_NAME);

        // Add unique scores back.
        for (var i=0; i<uniqueScores.length; i++) {
            const score = uniqueScores[i];
            PersistenceService._saveObj(SCORE_TABLE_NAME, i, score)
        }
    }
};

import { Fixtures } from 'charactersheet/utilities'

/**
 * A convenience class for constructing pairs of percentages that will be processed later.
 *
 * @field value  percentage that represents a particular value
 * @field weight  percentage that determines how valuable the given value is
 *
 * Sample object:
 * StatusWeightPair(0.89, 0.30)
 */
export function StatusWeightPair(value, weight) {
    var self = this;

    self.value = value;
    self.weight = weight;
}

/**
 * Processes array of StatusWeightPairs and return their calculated sums.
 *
 * @param valueWeightPairs  Contains a list of StatusWeightPair objects
 * @return totalStatusWeight  Decimal representation of StatusWeightPair list
 */
StatusWeightPair.processStatusWeights = function(valueWeightPairs) {
    var totalStatusWeight = 0;

    valueWeightPairs.forEach(function(pair, i, _) {
        totalStatusWeight += pair.value * pair.weight;
    });

    return totalStatusWeight;
};

/**
 * Determine what phrase to return based on the final status weight.
 *
 * @param statusType  Type of phrase map to use
 * @param totalStatusWeight  Final calculated weight of all StatusWeightPair
 * @return phrase  Corresponding status based on totalStatusWeight
 */
StatusWeightPair.determinePhraseAndColor = function(statusType, totalStatusWeight) {
    var phraseMap = [];

    if (statusType === getHealthTypeEnum()) {
        phraseMap = Fixtures.statusPhraseWordMap.health;
    } else if (statusType === getMagicTypeEnum()) {
        phraseMap = Fixtures.statusPhraseWordMap.magic;
    } else if (statusType === getTrackedTypeEnum()) {
        phraseMap = Fixtures.statusPhraseWordMap.tracked;
    }

    for (var i =0; i < phraseMap.length; i++) {
        if (i + 1 == phraseMap.length) {
            return phraseMap[i];
        }

        var upperBound = phraseMap[i];
        var lowerBound = phraseMap[i + 1];

        if (totalStatusWeight > lowerBound.value && totalStatusWeight <= upperBound.value) {
            return phraseMap[i];
        }
    }
};

export function getHealthTypeEnum() {
    return 'health';
}
export function getMagicTypeEnum() {
    return 'magic';
}
export function getTrackedTypeEnum() {
    return 'tracked';
}


PersistenceService.addToRegistry(StatusWeightPair);

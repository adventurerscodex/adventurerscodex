import { DataRepository } from 'charactersheet/utilities/data_repository';

/**
 * Return a random POI Name.
 */
export const randomPointOfInterest = () => {
    const adjectives = DataRepository.pointsOfInterest.adjectives;
    const nouns = DataRepository.pointsOfInterest.nouns;

    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    const shouldIncludeAdjective = Math.random() >= 0.85;
    if (!shouldIncludeAdjective) {
        return `The ${randomNoun}`;
    }

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    return `The ${randomAdjective} ${randomNoun}`;
}

import {SharedServiceManager} from './shared_service_manager';
var Random = require('random-js');

/**
 * A utility class that generates random numbers on demand.
 * The service's functionality is primarily built on code from the random-js package
 * random-js is capable of generating pseudo-random numbers using a seeded Mersenner Twister,
 * generating cryptographically secure random numbers using windows.crypto.getRandomValues(),
 * and generating pseudo-random numbers using the browser's native math (using Math.random())
 *
 * Default: Auto-seeded Mersenne Twister engine
 */

export var RandomNumberGeneratorService = new SharedServiceManager(_RandomNumberGeneratorService, {});

function _RandomNumberGeneratorService(configuration) {
    var self = this;
    self.RNG = Random.engines.mt19937().autoSeed();
    /**
     * Create a random number generator that uses Math.random()
     *
     * @returns Random()
     */
    self.nativeMath = function() {
        return self.RNG = Random();
    };

    /**
     * Create a seeded Mersenne Twister engine for "more random" random number generation
     * more random than Math.random()
     *
     * @returns Random(Random.engines.mt19937)
     */
    self.mersenneTwister = function(seed = undefined) {
        if(seed === undefined) {
            return self.RNG = new Random(Random.engines.mt19937().autoSeed());
        }
        else if(!isNaN(seed)) {
            return self.RNG = new Random(Random.engines.mt19937().seed(seed));
        }
        else if(seed.constructor === Array) {
            return self.RNG = new Random(Random.engines.mt19937().seedWithArray(seed));
        }
    };

    /**
     * Roll a single dice using the RNG object
     *
     *  numSides (int) - highest face value
     *  @returns number
     */
    self.rollDie = function (numSides) {
        return self.RNG.die(numSides);
    };

    /**
     * Roll multiple dice
     * example: RNG.rollDice(3, 6) is equivalent to rolling 3 die 6
     *
     * @param numDice
     * @param numSides
     * @returns {Array}
     */
    self.rollDice = function (numDice, numSides) {
        return self.RNG.integer(numDice, (numSides * numDice));
    };

    /**
     * Roll multiple dice and store each result in the next array index until it is full
     * example: RNG.rollDiceArray(6, 3, 6) is equivalent to rolling 3 die 6, 6 times in a row
     *
     * @param numDice
     * @param numSides
     * @param numRolls
     * @returns {Array}
     */
    self.rollDiceArray = function (numDice, numSides, numRolls) {
        var array = [numRolls];
        for (var i = 0; i < numRolls; i++) {
            array[i] = this.rollDice(numDice, numSides);
        }
        return array;
    };

    /**
     * Simulates flipping a fair coin using booleans
     *
     * @returns bool
     */
    self.flipFairCoin = function () {
        return self.RNG.bool();
    };

    /**
     * Simulates flipping an unfair coin given a ratio or percentage
     * which determines chance of returning True
     *
     * @param numerator
     * @param denominator
     * @param percentage
     * @returns bool
     */
    self.flipUnfairCoin = function (percentage = undefined, numerator, denominator) {
        if(percentage === undefined) {
            return self.RNG.bool(numerator, denominator);
        }
        return self.RNG.bool(percentage)
    };
}

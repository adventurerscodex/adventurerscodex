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
    self.RNG = new Random(Random.engines.mt19937().autoSeed());
    /**
     * Create a random number generator that uses Math.random()
     *
     * @returns Random()
     */
    self.nativeMath = function() {
        return self.RNG = new Random();
    };

    /**
     * Create a seeded Mersenne Twister engine for "more random" random number generation
     * more random than Math.random()
     *
     * @returns Random(Random.engines.mt19937)
     */
    self.mersenneTwister = function() {
        return self.RNG = new Random(Random.engines.mt19937().autoSeed());
    };

    /**
     * Roll a single dice using the RNG object
     *
     *  maxValue (int) - highest face value
     *  @returns number
     */
    self.rollDie = function (maxValue) {
        return self.RNG.integer(1, maxValue);
    };

    /**
     * Roll multiple dice
     * example: RNG.rollDice(3, 6) is equivalent to rolling 3 die 6
     *
     * @param numDice
     * @param maxValue
     * @returns {Array}
     */
    self.rollDice = function (numDice, maxValue) {
        return self.RNG.integer(numDice, (maxValue * numDice));
    };

    /**
     * Roll multiple dice and store each result in the next array index until it is full
     * example: RNG.rollDice(6, 3, 6) is equivalent to rolling 3 die 6, 6 times in a row
     *
     * @param numDice
     * @param maxValue
     * @param numRolls
     * @returns {Array}
     */
    self.rollDiceArray = function (numDice, maxValue, numRolls) {
        var array = [numRolls];
        for (var i = 0; i < numRolls; i++) {
            array[i] = this.rollDice(numDice, maxValue);
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
     * Simulates flipping an unfair coin given a ratio which determines chance of returning True
     *
     * @param numerator
     * @param denominator
     * @returns bool
     */
    self.flipUnfairCoin = function (numerator, denominator) {
        return self.RNG.bool(numerator, denominator);
    };
}

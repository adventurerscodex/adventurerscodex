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

export var RandomNumberGeneratorService = {
    _RNG: new Random(Random.engines.mt19937().autoSeed()),

    /**
     * Create a random number generator that uses Math.random()
     *
     * @returns Random()
     */
    nativeMath: function() {
        return new Random();
    },

    /**
     * Create and seed a Mersenne Twister engine for "more random" random number generation
     * more random than Math.random()
     *
     * @returns Random(engine) - a Mersenner Twister generator object
     */
    mersenneTwister: function() {
        return this._RNG(Random.engines.mt19937().autoSeed());
    },

    /**
     * Roll a single dice using the global _RNG object
     *
     *  maxValue (int) - highest face value
     */
    rollDie: function (maxValue) {
        return this._RNG.integer(1, maxValue);
    },

    /**
     * Roll multiple dice
     * example: _RNG.rollDice(3, 6) is equivalent to rolling 3 die 6
     *
     * @param numDice
     * @param maxValue
     * @returns {Array}
     */
    rollDice: function (numDice, maxValue) {
        return this._RNG.integer(numDice, (maxValue * numDice));
    },

    /**
     * Roll multiple dice and store each result in the next array index until it is full
     * example: mtRandom.rollDice(6, 3, 6) is equivalent to rolling 3 die 6, 6 times in a row
     *
     * @param numRolls
     * @param numDice
     * @param maxValue
     * @returns {Array}
     */
    rollDiceArray: function (numRolls, numDice, maxValue) {
        var array = [numRolls];
        for (var i = 0; i < numRolls; i++) {
            array[i] = this.rollDice(numDice, maxValue);
        }
        return array;
    },

    /**
     * Simulates flipping a fair coin using booleans
     *
     * @returns bool
     */
    flipFairCoin: function () {
        return this._RNG.bool();
    },

    /**
     * Simulates flipping an unfair coin given a ratio which determines chance of returning True
     *
     * @param numerator
     * @param denominator
     * @returns bool
     */
    flipUnfairCoin: function (numerator, denominator) {
        return this._RNG.bool(numerator, denominator);
    }
};

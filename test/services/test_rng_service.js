import Random from 'random-js';
import { RandomNumberGeneratorService } from 'charactersheet/services/common/rng_service';
import simple from 'simple-mock';

describe('Random Number Generator Service', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Native Math', function() {
        it('should return a random number generator object that uses Math.random()', function() {
            var rngService = RandomNumberGeneratorService.sharedService();
            var rng = rngService.nativeMath();

            rng.should.be.instanceOf(Random);
            rng.engine.should.have.type(typeof Random.engines.nativeMath);
        });
    });

    describe('Mersenne Twister', function() {
        it('should return a random number generator object that uses a seeded Mersenne Twister', function() {
            var randInt = Math.random();
            var intArray = [1,5,6];
            var rngService = RandomNumberGeneratorService.sharedService();
            var rng = rngService.mersenneTwister();

            rng.should.be.instanceOf(Random);
            rng.engine.should.have.type(typeof Random.engines.mt19937);

            rng = rngService.mersenneTwister(randInt);

            rng.should.be.instanceOf(Random);
            rng.engine.should.have.type(typeof Random.engines.mt19937);

            rng = rngService.mersenneTwister(intArray);

            rng.should.be.instanceOf(Random);
            rng.engine.should.have.type(typeof Random.engines.mt19937);
        });
    });

    describe('Roll Die', function() {
        it('should return a number', function() {
            var numSides = 6;
            var invalidMinValue = 0;
            var rngService = RandomNumberGeneratorService.sharedService();
            var result = rngService.rollDie(numSides);

            result.should.be.type('number');
            result.should.be.above(invalidMinValue);
            result.should.be.below(numSides + 1);
        });
    });

    describe('Roll Dice', function() {
        it('should return a number', function() {
            var numDice = 3;
            var numSides = 6;
            var rngService = RandomNumberGeneratorService.sharedService();
            var result = rngService.rollDice(numDice, numSides);

            result.should.be.type('number');
            result.should.be.above(numDice - 1);
            result.should.be.below((numDice * numSides) + 1);
        });
    });

    describe('Roll Dice Array', function() {
        it('should return an array of numbers', function() {
            var numDice = 3;
            var numSides = 6;
            var numRolls = 6;
            var rngService = RandomNumberGeneratorService.sharedService();
            rngService.mersenneTwister();
            var result = rngService.rollDiceArray(numDice, numSides, numRolls);

            result.should.have.length(numRolls);
            for(var i = 0; i < numRolls; i++) {
                result[i].should.be.type('number');
                result[i].should.be.above(numDice - 1);
                result[i].should.be.below((numDice * numSides) + 1);
            }
        });
    });

    describe('Flip Fair Coin', function() {
        it('should return a boolean value', function() {
            var rngService = RandomNumberGeneratorService.sharedService();
            var result = rngService.flipFairCoin();

            result.should.be.type('boolean');
        });
    });

    describe('Flip Unfair Coin', function() {
        it('should return a boolean value', function() {
            var numerator = 1;
            var denominator = 6;
            var percentage = 80;
            var rngService = RandomNumberGeneratorService.sharedService();
            var result = rngService.flipUnfairCoin(numerator, denominator);

            result.should.be.type('boolean');

            result = rngService.flipUnfairCoin(percentage);
        });
    });
});

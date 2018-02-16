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

            rngService.RNG.should.be.instanceOf(Random);
            rngService.RNG.engine.should.type(typeof Random.engines.nativeMath);
        });
    });

    describe('Mersenne Twister', function() {
        it('should return a random number generator object that uses a seeded Mersenne Twister', function() {
            var rngService = RandomNumberGeneratorService.sharedService();

            rngService.RNG.should.be.instanceOf(Random);
            rngService.RNG.engine.should.type(typeof Random.engines.mt19937);
        });
    });

    describe('Roll Die', function() {
        it('should return a number', function() {
            var rngService = RandomNumberGeneratorService.sharedService();
            var maxFaceValue = 6;
            var result = rngService.rollDie(maxFaceValue);

            result.should.be.type('number');
            result.should.be.above(0);
            result.should.be.below(maxFaceValue+1);
        });
    });

    describe('Roll Dice', function() {
        it('should return a number', function() {
            var rngService = RandomNumberGeneratorService.sharedService();
            var numDice = 3;
            var maxFaceValue = 6;
            var result = rngService.rollDice(numDice, maxFaceValue);

            result.should.be.type('number');
            result.should.be.above(numDice-1);
            result.should.be.below((numDice * maxFaceValue) + 1);
        });
    });

    describe('Roll Dice Array', function() {
        it('should return an array of numbers', function() {
            var rngService = RandomNumberGeneratorService.sharedService();
            var numDice = 3;
            var maxFaceValue = 6;
            var numRolls = 6;
            var result = rngService.rollDiceArray(numDice, maxFaceValue, numRolls);

            result.should.have.length(numRolls);
            for(var i = 0; i < numRolls; i++) {
                result[i].should.be.type('number');
                result[i].should.be.above(numDice-1);
                result[i].should.be.below((numDice * maxFaceValue) + 1);
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
            var rngService = RandomNumberGeneratorService.sharedService();
            var result = rngService.flipUnfairCoin(1, 5);

            result.should.be.type('boolean');
        });
    });
});

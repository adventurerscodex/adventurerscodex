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
            var spy1 = simple.mock(rngService, 'nativeMath');

            rngService.RNG.should.be.instanceOf(Random);
            rngService.RNG.engine.should.type(typeof Random.engines.nativeMath);
        });
    });

    describe('Mersenne Twister', function() {
        it('should return a random number generator object that uses a seeded Mersenne Twister', function() {
            var rngService = RandomNumberGeneratorService.sharedService();
            var spy1 = simple.mock(rngService, 'mersenneTwister');

            rngService.RNG.should.be.instanceOf(Random);
            rngService.RNG.engine.should.type(typeof Random.engines.mt19937);
        });
    });

    describe('Flip Fair Coin', function() {
        it('should return a boolean value', function() {
            var rngService = RandomNumberGeneratorService.sharedService();
            var spy1 = simple.mock(rngService, 'flipFairCoin');
            var result = rngService.flipFairCoin();

            result.should.type('boolean');
            spy1.called.should.equal(true);
        });
    });
});

import Should from 'should'

import { AppearanceFixture } from '../fixtures'
>>>>>>> Stashed changes
import { CharacterAppearance } from 'charactersheet/models/character/appearance'

describe('Appearance Model', function() {
    describe('Clear', function() {
        it('should clear all the values', function() {
            var p = new CharacterAppearance();
            p.height('Bob');
            p.height().should.equal('Bob');
            p.clear();
            p.height().should.equal('');
        });
    });

    describe('Export', function() {
        it('should yield an object with all the info supplied.', function() {
            var p = new CharacterAppearance();
            p.height('Bob');
            p.weight('fsddssd');
            p.skinColor('fdsdsf');
            var a = p.exportValues();
            p.height().should.equal(a.height);
            p.weight().should.equal(a.weight);
            p.skinColor().should.equal(a.skinColor);
        });
    });

    describe('Import', function() {
        it('should import an object with all the info supplied.', function() {
            var p = new CharacterAppearance();
            p.importValues(AppearanceFixture);
            p.height().should.equal(AppearanceFixture.height);
            p.weight().should.equal(AppearanceFixture.weight);
            p.skinColor().should.equal(AppearanceFixture.skinColor);
        });
    });
});


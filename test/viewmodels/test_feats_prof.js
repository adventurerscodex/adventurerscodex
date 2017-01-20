'use strict';

describe('Feats Prof View Model', function() {
    describe('Load', function() {
        it('should load the data from the FeatsProf db.', function() {
            var c = CharacterManager.activeCharacter;
            CharacterManager.activeCharacter = function() {
                return {
                    key: function() { return '1234'; }
                };
            };

            var fp = new FeatsProf();
            fp.feats('hi');
            fp.characterId('1234');
            PersistenceService.findBy = function(key) { return [ fp, new FeatsProf()]; };
            var featsProfVM = new FeatsProfViewModel();
            featsProfVM.featsProf().feats().should.equal('');
            featsProfVM.load();
            featsProfVM.featsProf().feats().should.equal('hi');

            CharacterManager.activeCharacter = c;
        });
    });

    describe('Unload', function() {
        it('should unload the data to the FeatsProf db.', function() {
            //Shims
            var c = CharacterManager.activeCharacter;
            CharacterManager.activeCharacter = function() {
                return {
                    key: function() { return '1234'; }
                };
            };

            var fp = new FeatsProf();
            fp.feats('hi');
            fp.characterId('1234');
            var saved = [false, false];
            var _find = PersistenceService.findBy;
            PersistenceService.findBy = function(key) {
                return [fp, new FeatsProf()].map(function(e, i, _) {
                    e.save = function() { saved[i] = true; };
                    return e;
                });
            };
            saved.forEach(function(e, i, _) {
                e.should.equal(false);
            });
            //Test
            var featsProfVM = new FeatsProfViewModel();
            featsProfVM.load();
            saved.forEach(function(e, i, _) {
                e.should.equal(false);
            });

            featsProfVM.unload();
            saved[0].should.equal(true);

            //Other test
            saved = [false, false];
            PersistenceService.findBy = function(key) {
                return [];
            };
            featsProfVM = new FeatsProfViewModel();
            featsProfVM.load();
            saved.forEach(function(e, i, _) {
                e.should.equal(false);
            });

            featsProfVM.unload();
            saved[0].should.equal(false);



            PersistenceService.findBy = _find;
            CharacterManager.activeCharacter = c;
        });
    });
});

/*eslint no-console:0*/
import {
    Character,
    Profile
} from 'charactersheet/models';
import {
    CharacterFixture,
    ProfileFixture,
    WeaponFixture
} from '../fixtures';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { PlayerTypes } from 'charactersheet/models/common/player_types';
import { jebeddo_data } from '../characters/jebeddo_data';
import simple from 'simple-mock';

describe('Character Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Save', function() {
        it('should save the values.', function() {
            var ft = new Character();
            var saved = false;
            ft.ps.save = function() { saved = true; };

            saved.should.equal(false);
            ft.save();
            saved.should.equal(true);
        });
    });

    describe('Export', function() {
        it('should export the values.', function() {
            var ft = new Character();
            ft.isDefault(true);
            ft.isDefault().should.equal(true);
            var e = ft.exportValues();
            ft.isDefault().should.equal(e.isDefault);
        });
    });

    describe('Delete', function() {
        it('should delete the objects.', function() {
            var ft = new Character();
            var deleted = false;
            ft.ps.delete = function() { deleted = true; };

            deleted.should.equal(false);
            ft.delete();
            deleted.should.equal(true);
        });
    });

    describe('Player Summary', function() {
        it('should fetch the details for a given player. said summary should be identical to the profile summary.', function() {
            var mockProfile = new Profile();
            mockProfile.importValues(ProfileFixture);
            simple.mock(PersistenceService, 'findFirstBy').returnWith(mockProfile);

            var cha = new Character();
            cha.playerType(PlayerTypes.characterPlayerType);
            cha.playerSummary().should.equal(mockProfile.summary());
        });
    });

    describe('Player Author', function() {
        it('should fetch the details for a given player. said author should be identical to the profile author.', function() {
            var mockProfile = new Profile();
            mockProfile.importValues(ProfileFixture);
            simple.mock(PersistenceService, 'findFirstBy').returnWith(mockProfile);

            var cha = new Character();
            cha.playerType(PlayerTypes.characterPlayerType);
            cha.playerAuthor().should.equal(mockProfile.playerName());
        });
    });

    describe('Player Title', function() {
        it('should fetch the details for a given player. said title should be identical to the profile title.', function() {
            var mockProfile = new Profile();
            mockProfile.importValues(ProfileFixture);
            simple.mock(PersistenceService, 'findFirstBy').returnWith(mockProfile);

            var cha = new Character();
            cha.playerType(PlayerTypes.characterPlayerType);
            cha.playerTitle().should.equal(mockProfile.characterName());
        });
    });

    // describe('Export Character', function() {
    //     it('should return a json document containing the details of a character.', function() {
    //         var keys = Object.keys(jebeddo_data);
    //         simple.mock(PersistenceService, 'listAll').returnWith(keys);
    //         simple.mock(PersistenceService, 'findAll').callFn(function(model) {
    //             return jebeddo_data[model.name].map(function(data, idx, _) {
    //                 var obj = new model();
    //                 obj.importValues(data);
    //                 return obj;
    //             });
    //         });

    //         var key = jebeddo_data['Character'][0].key;
    //         var data = Character.exportCharacter(key);
    //         var list_data = JSON.stringify(data).split(',');
    //         var list_expected = JSON.stringify(jebeddo_data).split(',');

    //         list_data.forEach(function(item, idx, _) {
    //             console.log(list_expected[idx], item);
    //             item.should.equal(list_expected[idx]);
    //         });
    //     });
    // });

    describe('Save Character to File', function() {
        it('should call saveAs and save data to a file.', function() {
            simple.mock(Character, 'exportCharacter').returnWith(jebeddo_data);
            var spy = simple.mock(window, 'saveAs');
            simple.mock(window, 'Blob').returnWith({});

            var cha = new Character();
            cha.saveToFile();
            spy.called.should.equal(true);

        });
    });

    describe('Change Id For Data', function() {
        it('should change the value of the character id or key property in a given json model.', function() {
            var newId = '987654321';
            WeaponFixture.characterId.should.not.equal(newId);
            var newWeapon = Character._changeIdForData(newId, WeaponFixture);
            newWeapon.characterId.should.equal(newId);

            CharacterFixture.key.should.not.equal(newId);
            var newChar = Character._changeIdForData(newId, CharacterFixture);
            newChar.key.should.equal(newId);
        });
    });
});

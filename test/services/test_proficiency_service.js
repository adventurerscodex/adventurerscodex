import { Notifications } from 'charactersheet/utilities';
import { OtherStats } from 'charactersheet/models/character/other_stats';
import { PersistenceService } from 'charactersheet/services/common';
import { ProficiencyService } from 'charactersheet/services/character';
import { Profile } from 'charactersheet/models/character/profile';
import simple from 'simple-mock';

describe('Proficiency Service', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Init', function() {
        it('should subscribe to relevant viewmodels and calculate first proficiency', function() {
            var spy1 = simple.mock(Notifications.otherStats.proficiency.changed, 'add');
            simple.mock(PersistenceService, 'findFirstBy').callFn(function(model, property, value) {
                if (model.name === 'OtherStats') {
                    var otherStats = new OtherStats();
                    otherStats.proficiency(1);
                    return otherStats;
                } else if (model.name === 'Profile') {
                    var profile = new Profile();
                    profile.level(2);
                    return profile;
                }
            });

            var proficiencyService = ProficiencyService.sharedService();
            proficiencyService.init();
            var proficiency = proficiencyService.proficiency();
            proficiency.should.equal(3);
            spy1.called.should.equal(true);
        });
    });

    describe('DataHasChanged', function() {
        it('should return the total proficiency, which would be 3', function() {
            var spy = simple.mock(Notifications.proficiencyBonus.changed, 'dispatch');
            simple.mock(PersistenceService, 'findFirstBy').callFn(function(model, property, value) {
                if (model.name === 'OtherStats') {
                    var otherStats = new OtherStats();
                    otherStats.proficiency(1);
                    return otherStats;
                } else if (model.name === 'Profile') {
                    var profile = new Profile();
                    profile.level(2);
                    return profile;
                }
            });

            var proficiencyService = ProficiencyService.sharedService();
            proficiencyService.dataHasChanged();
            var proficiency = proficiencyService.proficiency();
            proficiency.should.equal(3);
            spy.called.should.equal(true);
        });
    });

    describe('Level bonus', function() {
        it('should return the current level bonus', function() {
            var profile = new Profile();
            profile.level(2);
            simple.mock(PersistenceService, 'findFirstBy').returnWith(profile);

            var proficiencyService = ProficiencyService.sharedService();
            var level = proficiencyService.proficiencyBonusByLevel();
            level.should.equal(1);
        });
        it('should fail at parsing level and return 0', function() {
            var profile = new Profile();
            profile.level('asd');
            simple.mock(PersistenceService, 'findFirstBy').returnWith(profile);

            var proficiencyService = ProficiencyService.sharedService();
            var level = proficiencyService.proficiencyBonusByLevel();
            level.should.equal(0);
        });
        it('should not receive a valid profile and return 0', function() {
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);

            var proficiencyService = ProficiencyService.sharedService();
            var level = proficiencyService.proficiencyBonusByLevel();
            level.should.equal(0);
        });
    });

    describe('Proficiency bonus', function() {
        it('should return the current proficiency modifier', function() {
            var otherStats = new OtherStats();
            otherStats.proficiency(1);
            simple.mock(PersistenceService, 'findFirstBy').returnWith(otherStats);

            var proficiencyService = ProficiencyService.sharedService();
            var proficiencyModifier = proficiencyService.proficiencyModifier();
            proficiencyModifier.should.equal(1);
        });
        it('should fail at parsing proficiency and return 0', function() {
            var otherStats = new OtherStats();
            otherStats.proficiency('asd');
            simple.mock(PersistenceService, 'findFirstBy').returnWith(otherStats);

            var proficiencyService = ProficiencyService.sharedService();
            var proficiencyModifier = proficiencyService.proficiencyModifier();
            proficiencyModifier.should.equal(0);
        });
        it('should not receive a valid otherStats and return 0', function() {
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);

            var proficiencyService = ProficiencyService.sharedService();
            var proficiencyModifier = proficiencyService.proficiencyModifier();
            proficiencyModifier.should.equal(0);
        });
    });
});

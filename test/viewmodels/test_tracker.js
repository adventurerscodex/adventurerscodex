'use strict';

describe('Daily Features View Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Load', function() {
        it('should not load model and section', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var trackerViewModel = new TrackerViewModel();
            var spy1 = simple.mock(Notifications.global.save, 'add');
            var spy2 = simple.mock(Notifications.feat.changed, 'add');
            var spy3 = simple.mock(Notifications.trait.changed, 'add');
            var spy4 = simple.mock(Notifications.feature.changed, 'add');
            var spy5 = simple.mock(Notifications.events.shortRest, 'add');
            var spy6 = simple.mock(Notifications.events.longRest, 'add');
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);
            simple.mock(PersistenceService, 'findBy').returnWith(null);

            vm.load();

            spy1.called.should.equal(true);
            spy2.called.should.equal(true);
            spy3.called.should.equal(true);
            spy4.called.should.equal(true);
            spy5.called.should.equal(true);
            spy6.called.should.equal(true);
        });
        it('should load model and section', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new MonsterSectionViewModel(new Encounter());
            var spy1 = simple.mock(Notifications.global.save, 'add');
            var spy2 = simple.mock(Notifications.encounters.changed, 'add');
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new MonsterSection());
            simple.mock(PersistenceService, 'findBy').callFn(function(model, property, value) {
                if (model.name === 'Monster') {
                    return [new Monster()];
                } else if (model.name === 'MonsterAbilityScore') {
                    return [new MonsterAbilityScore()];
                }
            });

            vm.load();

            spy1.called.should.equal(true);
            spy2.called.should.equal(true);
        });
    });

    describe('Add daily features', function() {
        it('should add a new daily feature to the list of daily features', function() {
            var trackerViewModel = new TrackerViewModel();
            trackerViewModel.trackables().length.should.equal(0);
            trackerViewModel.addDailyFeature();
            trackerViewModel.trackables().length.should.equal(1);

            CharacterManager.activeCharacter = c;
        });
    });

    describe('Remove daily feature', function() {
        it('should remove a feature from the list of trackables', function() {
            var trackerViewModel = new TrackerViewModel();
            trackerViewModel.trackables().length.should.equal(0);
            trackerViewModel.addDailyFeature();
            trackerViewModel.trackables().length.should.equal(1);
            trackerViewModel.removeDailyFeature(trackerViewModel.trackables().pop());
            trackerViewModel.trackables().length.should.equal(0);

            CharacterManager.activeCharacter = c;
        });
    });

    describe('Sort By', function() {
        it('should sort the list of trackables by given criteria', function() {
            var trackerViewModel = new TrackerViewModel();
            trackerViewModel.sortBy('featureName');
            trackerViewModel.sort().should.equal(trackerViewModel.sorts['featureName desc']);
            trackerViewModel.sortBy('featureName');
            trackerViewModel.sort().should.equal(trackerViewModel.sorts['featureName asc']);
            trackerViewModel.sortBy('featureMaxUses');
            trackerViewModel.sort().should.equal(trackerViewModel.sorts['featureMaxUses asc']);
            trackerViewModel.sortBy('featureMaxUses');
            trackerViewModel.sort().should.equal(trackerViewModel.sorts['featureMaxUses desc']);
            trackerViewModel.sortBy('featureResetsOn');
            trackerViewModel.sort().should.equal(trackerViewModel.sorts['featureResetsOn asc']);
            trackerViewModel.sortBy('featureResetsOn');
            trackerViewModel.sort().should.equal(trackerViewModel.sorts['featureResetsOn desc']);
        });
    });

    describe('Sort Arrow', function() {
        it('should sort the list of trackables by given criteria', function() {
            var trackerViewModel = new TrackerViewModel();
            trackerViewModel.sortBy('featureName');
            trackerViewModel.sort().should.equal(trackerViewModel.sorts['featureName desc']);
            trackerViewModel.sortArrow('featureName').should.equal('fa fa-arrow-down fa-color');
            trackerViewModel.sortArrow('featureMaxUses').should.equal('');
            trackerViewModel.sortBy('featureName');
            trackerViewModel.sort().should.equal(trackerViewModel.sorts['featureName asc']);
            trackerViewModel.sortArrow('featureName').should.equal('fa fa-arrow-up fa-color');
            trackerViewModel.sortArrow('featureMaxUses').should.equal('');
            trackerViewModel.sortBy('featureResetsOn');
            trackerViewModel.sort().should.equal(trackerViewModel.sorts['featureResetsOn asc']);
            trackerViewModel.sortArrow('featureResetsOn').should.equal('fa fa-arrow-up fa-color');
            trackerViewModel.sortArrow('featureMaxUses').should.equal('');
            trackerViewModel.sortArrow('featureName').should.equal('');
        });
    });

    describe('Max daily feature Width', function() {
        it('should return the width of the daily feature bar as a percent.', function() {
            var trackerViewModel = new TrackerViewModel();
            trackerViewModel.addDailyFeature();
            trackerViewModel.addDailyFeature();
            trackerViewModel.addDailyFeature();
            trackerViewModel.addDailyFeature();
            trackerViewModel.maxFeatureWidth().should.equal(25);

            CharacterManager.activeCharacter = c;
        });
    });

    describe('Reset trackables', function() {
        it('should reset a daily features counts to 0.', function() {
            var trackerViewModel = new TrackerViewModel();
            trackerViewModel.blankDailyFeature().featureMaxUses(5);
            trackerViewModel.addDailyFeature();

            trackerViewModel.trackables()[0].featureUsed(1);

            trackerViewModel.refreshDailyFeature(trackerViewModel.trackables()[0]);
            trackerViewModel.trackables()[0].featureUsed().should.equal(0);
        });
    });

    describe('Clear', function() {
        it('should clear all the values in spell trackables.', function() {
            var trackerViewModel = new TrackerViewModel();
            var trackables = [df];
            trackerViewModel.trackables(trackables);
            trackerViewModel.trackables().should.equal(trackables);
            trackerViewModel.clear();
            trackerViewModel.trackables().length.should.equal(0);
        });
    });
});

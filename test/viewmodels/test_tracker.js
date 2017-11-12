import {
    Feat,
    Feature,
    Tracked,
    Trait
} from 'charactersheet/models';
import { Notifications } from 'charactersheet/utilities';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { TrackerViewModel } from 'charactersheet/viewmodels/character/tracker';
import simple from 'simple-mock';

describe('Tracker View Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Load', function() {
        it('should not load model and section', function() {
            var trackerViewModel = new TrackerViewModel();
            var spy1 = simple.mock(Notifications.global.save, 'add');
            var spy2 = simple.mock(Notifications.feat.changed, 'add');
            var spy3 = simple.mock(Notifications.trait.changed, 'add');
            var spy4 = simple.mock(Notifications.feature.changed, 'add');
            var spy5 = simple.mock(Notifications.events.shortRest, 'add');
            var spy6 = simple.mock(Notifications.events.longRest, 'add');
            simple.mock(PersistenceService, 'findFirstBy').returnWith([]);
            simple.mock(PersistenceService, 'findBy').returnWith([]);

            trackerViewModel.load();

            spy1.called.should.equal(true);
            spy2.called.should.equal(true);
            spy3.called.should.equal(true);
            spy4.called.should.equal(true);
            spy5.called.should.equal(true);
            spy6.called.should.equal(true);
        });
        it('should load model and section', function() {
            var trackerViewModel = new TrackerViewModel();
            var spy1 = simple.mock(Notifications.global.save, 'add');
            var spy2 = simple.mock(Notifications.feat.changed, 'add');
            var spy3 = simple.mock(Notifications.trait.changed, 'add');
            var spy4 = simple.mock(Notifications.feature.changed, 'add');
            var spy5 = simple.mock(Notifications.events.shortRest, 'add');
            var spy6 = simple.mock(Notifications.events.longRest, 'add');
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new Tracked());
            simple.mock(PersistenceService, 'findBy').callFn(function(model, property, value) {
                if (model.name === 'Feat') {
                    var trackedFeat = new Feat();
                    trackedFeat.isTracked(true);
                    return [trackedFeat];
                } else if (model.name === 'Trait') {
                    return [];
                } else if (model.name === 'Feature') {
                    return [];
                }
            });

            trackerViewModel.load();

            spy1.called.should.equal(true);
            spy2.called.should.equal(true);
            spy3.called.should.equal(true);
            spy4.called.should.equal(true);
            spy5.called.should.equal(true);
            spy6.called.should.equal(true);
        });
    });

    describe('Unload', function() {
        it('unsubscribe from notifications and save iteself.', function() {
            var trackerViewModel = new TrackerViewModel();
            var spy1 = simple.mock(Notifications.global.save, 'remove');
            var spy2 = simple.mock(Notifications.feat.changed, 'remove');
            var spy3 = simple.mock(Notifications.trait.changed, 'remove');
            var spy4 = simple.mock(Notifications.feature.changed, 'remove');
            var spy5 = simple.mock(Notifications.events.shortRest, 'remove');
            var spy6 = simple.mock(Notifications.events.longRest, 'remove');

            trackerViewModel.unload();
            spy1.called.should.equal(true);
            spy2.called.should.equal(true);
            spy3.called.should.equal(true);
            spy4.called.should.equal(true);
            spy5.called.should.equal(true);
            spy6.called.should.equal(true);
        });
    });

    describe('Sort By', function() {
        it('should sort the list of trackables by given criteria', function() {
            var trackerViewModel = new TrackerViewModel();
            trackerViewModel.sortBy('name');
            trackerViewModel.sort().should.equal(trackerViewModel.sorts['name desc']);
            trackerViewModel.sortBy('name');
            trackerViewModel.sort().should.equal(trackerViewModel.sorts['name asc']);
        });
    });

    describe('Sort Arrow', function() {
        it('should sort the list of trackables by given criteria', function() {
            var trackerViewModel = new TrackerViewModel();
            trackerViewModel.sortBy('name');
            trackerViewModel.sort().should.equal(trackerViewModel.sorts['name desc']);
            trackerViewModel.sortArrow('name').should.equal('fa fa-arrow-down fa-color');
        });
    });

    describe('Max tracker Width', function() {
        it('should return the width of the tracker bar as a percent.', function() {
            var trackerViewModel = new TrackerViewModel();
            var trackables = [new Feat(), new Feat(), new Feat(), new Feat()];
            trackerViewModel.trackables(trackables);
            trackerViewModel.maxTrackerWidth().should.equal(25);
        });
    });

    describe('trackedElementProgressWidth', function() {
        it('should return the width of the tracker bar as a percent.', function() {
            var trackerViewModel = new TrackerViewModel();
            var width = trackerViewModel.trackedElementProgressWidth(2, 1);
            width.should.equal(0.5);
        });
    });

    describe('Reset trackables', function() {
        it('should reset a tracked item\'s counts to 0.', function() {
            var trackerViewModel = new TrackerViewModel();
            var feat = new Feat();
            feat.tracked(new Tracked());
            feat.tracked().used(3);
            var trackables = [feat];
            trackerViewModel.trackables(trackables);
            trackerViewModel.trackables()[0].tracked().used().should.equal(3);
            trackerViewModel.refreshTracked(trackerViewModel.trackables()[0]);
            trackerViewModel.trackables()[0].tracked().used().should.equal(0);
        });
    });

    describe('Clear', function() {
        it('should clear all the values in spell trackables.', function() {
            var trackerViewModel = new TrackerViewModel();
            var feat = new Feat();
            var trackables = [feat];
            trackerViewModel.trackables(trackables);
            trackerViewModel.trackables().should.equal(trackables);
            trackerViewModel.clear();
            trackerViewModel.trackables().length.should.equal(0);
        });
    });

    describe('resetShortRestFeatures', function() {
        it('reset all tracked items that reset on short rest', function() {
            var trackerViewModel = new TrackerViewModel();
            var feat = new Feat();
            feat.tracked(new Tracked());
            feat.tracked().used(3);
            feat.tracked().resetsOn('short');
            var feat2 = new Feat();
            feat2.tracked(new Tracked());
            feat2.tracked().used(3);
            feat2.tracked().resetsOn('long');
            trackerViewModel.trackables([feat, feat2]);
            trackerViewModel.resetShortRestFeatures();
            trackerViewModel.trackables().forEach(function(element, idx, _) {
                if (element.tracked().resetsOn() === 'short') {
                    element.tracked().used().should.equal(0);
                } else if (element.tracked().resetsOn() === 'long') {
                    element.tracked().used().should.equal(3);
                }
            });
        });
    });

    describe('resetLongRestFeatures', function() {
        it('reset all tracked items that reset on short or long rest', function() {
            var trackerViewModel = new TrackerViewModel();
            var feat = new Feat();
            feat.tracked(new Tracked());
            feat.tracked().used(3);
            feat.tracked().resetsOn('short');
            var feat2 = new Feat();
            feat2.tracked(new Tracked());
            feat2.tracked().used(3);
            feat2.tracked().resetsOn('long');
            trackerViewModel.trackables([feat, feat2]);
            trackerViewModel.resetLongRestFeatures();
            trackerViewModel.trackables().forEach(function(element, idx, _) {
                element.tracked().used().should.equal(0);
            });
        });
    });

    describe('Save', function() {
        it('should save all tracked items', function() {
            var trackerViewModel = new TrackerViewModel();
            var feat = new Feat();
            feat.tracked(new Tracked());
            var trackables = [feat];
            trackerViewModel.trackables(trackables);
            trackerViewModel.save();
        });
    });

    describe('modalFinishedAnimating', function() {
        it('set values after modal finishes animating', function() {
            var trackerViewModel = new TrackerViewModel();
            trackerViewModel.modifierHasFocus().should.equal(false);
            trackerViewModel.modalFinishedAnimating();
            trackerViewModel.modifierHasFocus().should.equal(true);
        });
    });

    describe('modalFinishedClosing', function() {
        it('close the modal', function() {
            var trackerViewModel = new TrackerViewModel();
            trackerViewModel.modalOpen().should.equal(false);
            trackerViewModel.modalFinishedClosing();
            trackerViewModel.modalOpen().should.equal(false);
        });
        it('save the tracked item', function() {
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new Tracked());
            var trackerViewModel = new TrackerViewModel();
            trackerViewModel.modalOpen(true);
            trackerViewModel.editItem(new Tracked);
            trackerViewModel.modalOpen().should.equal(true);
            trackerViewModel.modalFinishedClosing();
            trackerViewModel.modalOpen().should.equal(false);
        });
        it('save tracked item and update element in array', function() {
            var tracked = new Tracked();
            tracked.trackedId('123');
            simple.mock(PersistenceService, 'findFirstBy').returnWith(tracked);
            var trackerViewModel = new TrackerViewModel();
            trackerViewModel.modalOpen(true);
            trackerViewModel.editItem(new Tracked);
            var feat = new Feat();
            feat.tracked(new Tracked());
            feat.tracked().trackedId('123');
            trackerViewModel.trackables([feat]);
            trackerViewModel.modalOpen().should.equal(true);
            trackerViewModel.modalFinishedClosing();
            trackerViewModel.modalOpen().should.equal(false);
        });
    });

    describe('editModalOpen', function() {
        it('should open a modal', function() {
            var trackerViewModel = new TrackerViewModel();
            trackerViewModel.editHasFocus().should.equal(false);
            trackerViewModel.editModalOpen();
            trackerViewModel.editHasFocus().should.equal(true);
        });
    });

    describe('editTracked', function() {
        it('should open a modal', function() {
            var trackerViewModel = new TrackerViewModel();
            var feat = new Feat();
            feat.tracked(new Tracked());
            trackerViewModel.modalOpen().should.equal(false);
            trackerViewModel.editTracked(feat);
            trackerViewModel.modalOpen().should.equal(true);
        });
    });
});

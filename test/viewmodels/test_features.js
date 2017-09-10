import simple from 'simple-mock'

import { CharacterManager, DataRepository, Notifications } from 'charactersheet/utilities'
import { Feature, Tracked } from 'charactersheet/models/character'
import { FeaturesViewModel } from 'charactersheet/viewmodels/character/features'
import { PersistenceService, SortService } from 'charactersheet/services/common'

describe('FeaturesViewModel', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Add feature', function() {
        it('should add a new feature to the list of features', function() {
            var featuresViewModel = new FeaturesViewModel();
            featuresViewModel.features().length.should.equal(0);
            featuresViewModel.addFeature();
            featuresViewModel.features().length.should.equal(1);
        });
        it('should add create a feature and tracked model', function() {
            var featuresViewModel = new FeaturesViewModel();
            featuresViewModel.blankFeature().isTracked(true);
            featuresViewModel.features().length.should.equal(0);
            featuresViewModel.addFeature();
            featuresViewModel.features().length.should.equal(1);
        });
    });

    describe('Remove feature', function() {
        it('should remove a feature from the list of features', function() {
            var featuresViewModel = new FeaturesViewModel();
            featuresViewModel.features().length.should.equal(0);
            featuresViewModel.addFeature();
            featuresViewModel.features().length.should.equal(1);
            featuresViewModel.removeFeature(featuresViewModel.features().pop());
            featuresViewModel.features().length.should.equal(0);
        });
        it('should remove a feature from the list of features', function() {
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new Feature());
            var featuresViewModel = new FeaturesViewModel();
            featuresViewModel.features().length.should.equal(0);
            featuresViewModel.blankFeature().isTracked(true);
            featuresViewModel.addFeature();
            featuresViewModel.features().length.should.equal(1);
            featuresViewModel.removeFeature(featuresViewModel.features().pop());
            featuresViewModel.features().length.should.equal(0);
        });
    });

    describe('Edit feature', function() {
        it('should put a feature from the list of features into the selected slot', function() {
            var featuresViewModel = new FeaturesViewModel();
            featuresViewModel.addFeature();
            featuresViewModel.features().length.should.equal(1);
            featuresViewModel.editFeature(featuresViewModel.features()[0]);
        });
    });

    describe('Load', function() {
        it('should load the saved list of features', function() {
            simple.mock(PersistenceService, 'findBy').returnWith([new Feature()]);

            var featuresViewModel = new FeaturesViewModel();
            featuresViewModel.features().length.should.equal(0);
            featuresViewModel.load();
            featuresViewModel.features().length.should.equal(1);
        });
    });

    describe('Unload', function() {
        it('should unload the saved list of features', function() {
            var notificationSpy = simple.mock(Notifications.global.save, 'remove');

            var featuresViewModel = new FeaturesViewModel();
            notificationSpy.called.should.equal(false);
            featuresViewModel.unload();
            notificationSpy.called.should.equal(true);
        });
    });

    describe('modalFinishedOpening', function() {
        it('perform actions after a modal has opened', function() {
            var featuresViewModel = new FeaturesViewModel();

            featuresViewModel.shouldShowDisclaimer(false);
            featuresViewModel.firstModalElementHasFocus(false);
            featuresViewModel.modalFinishedOpening();
            featuresViewModel.shouldShowDisclaimer().should.equal(false);
            featuresViewModel.firstModalElementHasFocus().should.equal(true);
        });
    });

    describe('modalFinishedClosing', function() {
        it('perform actions after a modal has closed', function() {
            simple.mock(Notifications.trait.changed, 'dispatch').callFn(function(){});
            var featuresViewModel = new FeaturesViewModel();

            featuresViewModel.previewTabStatus('');
            featuresViewModel.editTabStatus('active');
            featuresViewModel.modalFinishedClosing();
            featuresViewModel.previewTabStatus().should.equal('active');
            featuresViewModel.editTabStatus().should.equal('');
        });
        it('saves edited item and creates a new tracked item', function() {
            simple.mock(Notifications.trait.changed, 'dispatch').callFn(function(){});
            var featuresViewModel = new FeaturesViewModel();

            featuresViewModel.previewTabStatus('');
            featuresViewModel.editTabStatus('active');
            featuresViewModel.modalOpen(true);
            featuresViewModel.currentEditItem().isTracked(true);
            featuresViewModel.modalFinishedClosing();
            featuresViewModel.previewTabStatus().should.equal('active');
            featuresViewModel.editTabStatus().should.equal('');
        });
        it('saves edited item and updates the tracked item', function() {
            simple.mock(Notifications.trait.changed, 'dispatch').callFn(function(){});
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new Tracked());
            var featuresViewModel = new FeaturesViewModel();

            featuresViewModel.previewTabStatus('');
            featuresViewModel.editTabStatus('active');
            featuresViewModel.modalOpen(true);
            featuresViewModel.currentEditItem().isTracked(true);
            featuresViewModel.currentEditItem().trackedId('123');
            featuresViewModel.modalFinishedClosing();
            featuresViewModel.previewTabStatus().should.equal('active');
            featuresViewModel.editTabStatus().should.equal('');
        });
        it('saves edited item and deletes the tracked item', function() {
            simple.mock(Notifications.trait.changed, 'dispatch').callFn(function(){});
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new Tracked());
            var featuresViewModel = new FeaturesViewModel();

            featuresViewModel.previewTabStatus('');
            featuresViewModel.editTabStatus('active');
            featuresViewModel.modalOpen(true);
            featuresViewModel.currentEditItem().trackedId('123');
            featuresViewModel.modalFinishedClosing();
            featuresViewModel.previewTabStatus().should.equal('active');
            featuresViewModel.editTabStatus().should.equal('');
        });
    });

    describe('selectPreviewTab', function() {
        it('perform actions after the preview tab has been selected', function() {
            var featuresViewModel = new FeaturesViewModel();

            featuresViewModel.previewTabStatus('');
            featuresViewModel.editTabStatus('active');
            featuresViewModel.selectPreviewTab();
            featuresViewModel.previewTabStatus().should.equal('active');
            featuresViewModel.editTabStatus().should.equal('');
        });
    });

    describe('selectEditTab', function() {
        it('perform actions after the preview tab has been selected', function() {
            var featuresViewModel = new FeaturesViewModel();

            featuresViewModel.previewTabStatus('active');
            featuresViewModel.editTabStatus('');
            featuresViewModel.selectEditTab();
            featuresViewModel.previewTabStatus().should.equal('');
            featuresViewModel.editTabStatus().should.equal('active');
            featuresViewModel.editFirstModalElementHasFocus().should.equal(true);
        });
    });

    describe('Sort By', function() {
        it('should sort the list of features by given criteria', function() {
            var featuresViewModel = new FeaturesViewModel();
            featuresViewModel.sortBy('name');
            featuresViewModel.sort().should.equal(featuresViewModel.sorts['name desc']);
            featuresViewModel.sortBy('name');
            featuresViewModel.sort().should.equal(featuresViewModel.sorts['name asc']);
        });
    });

    describe('Sort Arrow', function() {
        it('should sort the list of features by given criteria', function() {
            var featuresViewModel = new FeaturesViewModel();
            featuresViewModel.sortBy('name');
            featuresViewModel.sort().should.equal(featuresViewModel.sorts['name desc']);
            featuresViewModel.sortArrow('name').should.equal('fa fa-arrow-down fa-color');
            featuresViewModel.sortArrow('description').should.equal('');
            featuresViewModel.sortBy('name');
            featuresViewModel.sort().should.equal(featuresViewModel.sorts['name asc']);
            featuresViewModel.sortArrow('name').should.equal('fa fa-arrow-up fa-color');
            featuresViewModel.sortArrow('description').should.equal('');
        });
    });

    describe('Clear', function() {
        it('should clear all the values in features.', function() {
            var featuresViewModel = new FeaturesViewModel();
            var features = [new Feature()];

            featuresViewModel.addFeature();
            featuresViewModel.features().length.should.equal(1);
            featuresViewModel.clear();
            featuresViewModel.features().length.should.equal(0);
        });
    });

    describe('Save', function() {
        it('should save all the values in features.', function() {
            var featuresViewModel = new FeaturesViewModel();

            featuresViewModel.addFeature();
            featuresViewModel.features().length.should.equal(1);
            featuresViewModel.save();
        });
    });

    describe('trackedPopoverText', function() {
        it('should return a static string', function() {
            var featuresViewModel = new FeaturesViewModel();
            var description = featuresViewModel.trackedPopoverText();
            description.should.equal('Tracked Features are listed in the Tracker.');
        });
    });
});

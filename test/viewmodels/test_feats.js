import {
    CharacterManager,
    DataRepository,
    Notifications
} from 'charactersheet/utilities';
import {
    Feat,
    Tracked
} from 'charactersheet/models/character';
import {
    PersistenceService,
    SortService
} from 'charactersheet/services/common';
import { FeatsViewModel } from 'charactersheet/viewmodels/character/feats';
import should from 'Should';
import simple from 'simple-mock';

describe('FeatsViewModel', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Add feat', function() {
        it('should add a new feat to the list of feats', function() {
            var featsViewModel = new FeatsViewModel();
            featsViewModel.feats().length.should.equal(0);
            featsViewModel.addFeat();
            featsViewModel.feats().length.should.equal(1);
        });
        it('should add create a feat and tracked model', function() {
            var featsViewModel = new FeatsViewModel();
            featsViewModel.blankFeat().isTracked(true);
            featsViewModel.feats().length.should.equal(0);
            featsViewModel.addFeat();
            featsViewModel.feats().length.should.equal(1);
        });
    });

    describe('Remove feat', function() {
        it('should remove a feat from the list of feats', function() {
            var featsViewModel = new FeatsViewModel();
            featsViewModel.feats().length.should.equal(0);
            featsViewModel.addFeat();
            featsViewModel.feats().length.should.equal(1);
            featsViewModel.removeFeat(featsViewModel.feats().pop());
            featsViewModel.feats().length.should.equal(0);
        });
        it('should remove a feat from the list of feats', function() {
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new Feat());
            var featsViewModel = new FeatsViewModel();
            featsViewModel.feats().length.should.equal(0);
            featsViewModel.blankFeat().isTracked(true);
            featsViewModel.addFeat();
            featsViewModel.feats().length.should.equal(1);
            featsViewModel.removeFeat(featsViewModel.feats().pop());
            featsViewModel.feats().length.should.equal(0);
        });
    });

    describe('Edit feat', function() {
        it('should put a feat from the list of feats into the selected slot', function() {
            var featsViewModel = new FeatsViewModel();
            featsViewModel.addFeat();
            featsViewModel.feats().length.should.equal(1);
            featsViewModel.editFeat(featsViewModel.feats()[0]);
        });
    });

    describe('Load', function() {
        it('should load the saved list of feats', function() {
            simple.mock(PersistenceService, 'findBy').returnWith([new Feat()]);

            var featsViewModel = new FeatsViewModel();
            featsViewModel.feats().length.should.equal(0);
            featsViewModel.load();
            featsViewModel.feats().length.should.equal(1);
        });
    });

    describe('modalFinishedOpening', function() {
        it('perform actions after a modal has opened', function() {
            var featsViewModel = new FeatsViewModel();

            featsViewModel.shouldShowDisclaimer(false);
            featsViewModel.firstModalElementHasFocus(false);
            featsViewModel.modalFinishedOpening();
            featsViewModel.shouldShowDisclaimer().should.equal(false);
            featsViewModel.firstModalElementHasFocus().should.equal(true);
        });
    });

    describe('modalFinishedClosing', function() {
        it('perform actions after a modal has closed', function() {
            simple.mock(Notifications.trait.changed, 'dispatch').callFn(function(){});
            var featsViewModel = new FeatsViewModel();

            featsViewModel.previewTabStatus('');
            featsViewModel.editTabStatus('active');
            featsViewModel.modalFinishedClosing();
            featsViewModel.previewTabStatus().should.equal('active');
            featsViewModel.editTabStatus().should.equal('');
        });
        it('saves edited item and creates a new tracked item', function() {
            simple.mock(Notifications.trait.changed, 'dispatch').callFn(function(){});
            var featsViewModel = new FeatsViewModel();

            featsViewModel.previewTabStatus('');
            featsViewModel.editTabStatus('active');
            featsViewModel.modalOpen(true);
            featsViewModel.currentEditItem().isTracked(true);
            featsViewModel.modalFinishedClosing();
            featsViewModel.previewTabStatus().should.equal('active');
            featsViewModel.editTabStatus().should.equal('');
        });
        it('saves edited item and updates the tracked item', function() {
            simple.mock(Notifications.trait.changed, 'dispatch').callFn(function(){});
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new Tracked());
            var featsViewModel = new FeatsViewModel();

            featsViewModel.previewTabStatus('');
            featsViewModel.editTabStatus('active');
            featsViewModel.modalOpen(true);
            featsViewModel.currentEditItem().isTracked(true);
            featsViewModel.currentEditItem().trackedId('123');
            featsViewModel.modalFinishedClosing();
            featsViewModel.previewTabStatus().should.equal('active');
            featsViewModel.editTabStatus().should.equal('');
        });
        it('saves edited item and deletes the tracked item', function() {
            simple.mock(Notifications.trait.changed, 'dispatch').callFn(function(){});
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new Tracked());
            var featsViewModel = new FeatsViewModel();

            featsViewModel.previewTabStatus('');
            featsViewModel.editTabStatus('active');
            featsViewModel.modalOpen(true);
            featsViewModel.currentEditItem().trackedId('123');
            featsViewModel.modalFinishedClosing();
            featsViewModel.previewTabStatus().should.equal('active');
            featsViewModel.editTabStatus().should.equal('');
        });
    });

    describe('selectPreviewTab', function() {
        it('perform actions after the preview tab has been selected', function() {
            var featsViewModel = new FeatsViewModel();

            featsViewModel.previewTabStatus('');
            featsViewModel.editTabStatus('active');
            featsViewModel.selectPreviewTab();
            featsViewModel.previewTabStatus().should.equal('active');
            featsViewModel.editTabStatus().should.equal('');
        });
    });

    describe('selectEditTab', function() {
        it('perform actions after the preview tab has been selected', function() {
            var featsViewModel = new FeatsViewModel();

            featsViewModel.previewTabStatus('active');
            featsViewModel.editTabStatus('');
            featsViewModel.selectEditTab();
            featsViewModel.previewTabStatus().should.equal('');
            featsViewModel.editTabStatus().should.equal('active');
            featsViewModel.editFirstModalElementHasFocus().should.equal(true);
        });
    });

    describe('Sort By', function() {
        it('should sort the list of feats by given criteria', function() {
            var featsViewModel = new FeatsViewModel();
            featsViewModel.sortBy('name');
            featsViewModel.sort().should.equal(featsViewModel.sorts['name desc']);
            featsViewModel.sortBy('name');
            featsViewModel.sort().should.equal(featsViewModel.sorts['name asc']);
        });
    });

    describe('Sort Arrow', function() {
        it('should sort the list of feats by given criteria', function() {
            var featsViewModel = new FeatsViewModel();
            featsViewModel.sortBy('name');
            featsViewModel.sort().should.equal(featsViewModel.sorts['name desc']);
            featsViewModel.sortArrow('name').should.equal('fa fa-arrow-down fa-color');
            featsViewModel.sortArrow('description').should.equal('');
            featsViewModel.sortBy('name');
            featsViewModel.sort().should.equal(featsViewModel.sorts['name asc']);
            featsViewModel.sortArrow('name').should.equal('fa fa-arrow-up fa-color');
            featsViewModel.sortArrow('description').should.equal('');
        });
    });

    describe('Clear', function() {
        it('should clear all the values in feats.', function() {
            var featsViewModel = new FeatsViewModel();
            var feats = [new Feat()];

            featsViewModel.addFeat();
            featsViewModel.feats().length.should.equal(1);
            featsViewModel.clear();
            featsViewModel.feats().length.should.equal(0);
        });
    });

    describe('Save', function() {
        it('should save all the values in feats.', function() {
            var featsViewModel = new FeatsViewModel();

            featsViewModel.addFeat();
            featsViewModel.feats().length.should.equal(1);
            featsViewModel.save();
        });
    });

    describe('trackedPopoverText', function() {
        it('should return a static string', function() {
            var featsViewModel = new FeatsViewModel();
            var description = featsViewModel.trackedPopoverText();
            description.should.equal('Tracked Feats are listed in Feature Tracker.');
        });
    });
});

'use strict';

import simple from 'simple-mock'

import { Notifications } from 'charactersheet/utilities'
import { PersistenceService } from 'charactersheet/services/common'
import { Tracked, Trait } from 'charactersheet/models/character'

describe('TraitsViewModel', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Add trait', function() {
        it('should add a new trait to the list of traits', function() {
            var traitsViewModel = new TraitsViewModel();
            traitsViewModel.traits().length.should.equal(0);
            traitsViewModel.addTrait();
            traitsViewModel.traits().length.should.equal(1);
        });
        it('should add create a trait and tracked model', function() {
            var traitsViewModel = new TraitsViewModel();
            traitsViewModel.blankTrait().isTracked(true);
            traitsViewModel.traits().length.should.equal(0);
            traitsViewModel.addTrait();
            traitsViewModel.traits().length.should.equal(1);
        });
    });

    describe('Remove trait', function() {
        it('should remove a trait from the list of traits', function() {
            var traitsViewModel = new TraitsViewModel();
            simple.mock(Notifications.trait.changed, 'dispatch').callFn(function(){});
            traitsViewModel.traits().length.should.equal(0);
            traitsViewModel.addTrait();
            traitsViewModel.traits().length.should.equal(1);
            traitsViewModel.removeTrait(traitsViewModel.traits().pop());
            traitsViewModel.traits().length.should.equal(0);
        });
        it('should remove a trait from the list of traits', function() {
            var traitsViewModel = new TraitsViewModel();
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new Tracked());
            simple.mock(Notifications.trait.changed, 'dispatch').callFn(function(){});
            traitsViewModel.traits().length.should.equal(0);
            traitsViewModel.blankTrait().isTracked(true);
            traitsViewModel.addTrait();
            traitsViewModel.traits().length.should.equal(1);
            traitsViewModel.removeTrait(traitsViewModel.traits().pop());
            traitsViewModel.traits().length.should.equal(0);
        });
    });

    describe('Edit trait', function() {
        it('should put a trait from the list of traits into the selected slot', function() {
            var traitsViewModel = new TraitsViewModel();
            traitsViewModel.addTrait();
            traitsViewModel.traits().length.should.equal(1);
            traitsViewModel.editTrait(traitsViewModel.traits()[0]);
        });
        it('should put a trait from the list of traits into the selected slot', function() {
            var traitsViewModel = new TraitsViewModel();
            traitsViewModel.blankTrait().isTracked(true);
            traitsViewModel.addTrait();
            traitsViewModel.traits().length.should.equal(1);
            traitsViewModel.editTrait(traitsViewModel.traits()[0]);
        });
    });

    describe('Load', function() {
        it('should load the saved list of traits', function() {
            simple.mock(PersistenceService, 'findBy').returnWith([new Trait()]);

            var traitsViewModel = new TraitsViewModel();
            traitsViewModel.traits().length.should.equal(0);
            traitsViewModel.load();
            traitsViewModel.traits().length.should.equal(1);
        });
    });

    describe('Unload', function() {
        it('should unload the saved list of traits', function() {
            var notificationSpy = simple.mock(Notifications.global.save, 'remove');

            var traitsViewModel = new TraitsViewModel();
            notificationSpy.called.should.equal(false);
            traitsViewModel.unload();
            notificationSpy.called.should.equal(true);
        });
    });

    describe('modalFinishedOpening', function() {
        it('perform actions after a modal has opened', function() {
            var traitsViewModel = new TraitsViewModel();

            traitsViewModel.shouldShowDisclaimer(false);
            traitsViewModel.firstModalElementHasFocus(false);
            traitsViewModel.modalFinishedOpening();
            traitsViewModel.shouldShowDisclaimer().should.equal(false);
            traitsViewModel.firstModalElementHasFocus().should.equal(true);
        });
    });

    describe('modalFinishedClosing', function() {
        it('perform actions after a modal has closed', function() {
            simple.mock(Notifications.trait.changed, 'dispatch').callFn(function(){});
            var traitsViewModel = new TraitsViewModel();

            traitsViewModel.previewTabStatus('');
            traitsViewModel.editTabStatus('active');
            traitsViewModel.modalFinishedClosing();
            traitsViewModel.previewTabStatus().should.equal('active');
            traitsViewModel.editTabStatus().should.equal('');
        });
        it('saves edited item and creates a new tracked item', function() {
            simple.mock(Notifications.trait.changed, 'dispatch').callFn(function(){});
            var traitsViewModel = new TraitsViewModel();

            traitsViewModel.previewTabStatus('');
            traitsViewModel.editTabStatus('active');
            traitsViewModel.modalOpen(true);
            traitsViewModel.currentEditItem().isTracked(true);
            traitsViewModel.modalFinishedClosing();
            traitsViewModel.previewTabStatus().should.equal('active');
            traitsViewModel.editTabStatus().should.equal('');
        });
        it('saves edited item and updates the tracked item', function() {
            simple.mock(Notifications.trait.changed, 'dispatch').callFn(function(){});
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new Tracked());
            var traitsViewModel = new TraitsViewModel();

            traitsViewModel.previewTabStatus('');
            traitsViewModel.editTabStatus('active');
            traitsViewModel.modalOpen(true);
            traitsViewModel.currentEditItem().isTracked(true);
            traitsViewModel.currentEditItem().trackedId('123');
            traitsViewModel.modalFinishedClosing();
            traitsViewModel.previewTabStatus().should.equal('active');
            traitsViewModel.editTabStatus().should.equal('');
        });
        it('saves edited item and deletes the tracked item', function() {
            simple.mock(Notifications.trait.changed, 'dispatch').callFn(function(){});
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new Tracked());
            var traitsViewModel = new TraitsViewModel();

            traitsViewModel.previewTabStatus('');
            traitsViewModel.editTabStatus('active');
            traitsViewModel.modalOpen(true);
            traitsViewModel.currentEditItem().trackedId('123');
            traitsViewModel.modalFinishedClosing();
            traitsViewModel.previewTabStatus().should.equal('active');
            traitsViewModel.editTabStatus().should.equal('');
        });
    });

    describe('selectPreviewTab', function() {
        it('perform actions after the preview tab has been selected', function() {
            var traitsViewModel = new TraitsViewModel();

            traitsViewModel.previewTabStatus('');
            traitsViewModel.editTabStatus('active');
            traitsViewModel.selectPreviewTab();
            traitsViewModel.previewTabStatus().should.equal('active');
            traitsViewModel.editTabStatus().should.equal('');
        });
    });

    describe('selectEditTab', function() {
        it('perform actions after the preview tab has been selected', function() {
            var traitsViewModel = new TraitsViewModel();

            traitsViewModel.previewTabStatus('active');
            traitsViewModel.editTabStatus('');
            traitsViewModel.selectEditTab();
            traitsViewModel.previewTabStatus().should.equal('');
            traitsViewModel.editTabStatus().should.equal('active');
            traitsViewModel.editFirstModalElementHasFocus().should.equal(true);
        });
    });

    describe('Sort By', function() {
        it('should sort the list of traits by given criteria', function() {
            var traitsViewModel = new TraitsViewModel();
            traitsViewModel.sortBy('name');
            traitsViewModel.sort().should.equal(traitsViewModel.sorts['name desc']);
            traitsViewModel.sortBy('name');
            traitsViewModel.sort().should.equal(traitsViewModel.sorts['name asc']);
        });
    });

    describe('Sort Arrow', function() {
        it('should sort the list of traits by given criteria', function() {
            var traitsViewModel = new TraitsViewModel();
            traitsViewModel.sortBy('name');
            traitsViewModel.sort().should.equal(traitsViewModel.sorts['name desc']);
            traitsViewModel.sortArrow('name').should.equal('fa fa-arrow-down fa-color');
            traitsViewModel.sortArrow('description').should.equal('');
            traitsViewModel.sortBy('name');
            traitsViewModel.sort().should.equal(traitsViewModel.sorts['name asc']);
            traitsViewModel.sortArrow('name').should.equal('fa fa-arrow-up fa-color');
            traitsViewModel.sortArrow('description').should.equal('');
        });
    });

    describe('Clear', function() {
        it('should clear all the values in traits.', function() {
            var traitsViewModel = new TraitsViewModel();
            var traits = [new Trait()];

            traitsViewModel.addTrait();
            traitsViewModel.traits().length.should.equal(1);
            traitsViewModel.clear();
            traitsViewModel.traits().length.should.equal(0);
        });
    });

    describe('Save', function() {
        it('should save all the values in traits.', function() {
            var traitsViewModel = new TraitsViewModel();

            traitsViewModel.addTrait();
            traitsViewModel.traits().length.should.equal(1);
            traitsViewModel.save();
        });
    });

    describe('trackedPopoverText', function() {
        it('should return a static string', function() {
            var traitsViewModel = new TraitsViewModel();
            var description = traitsViewModel.trackedPopoverText();
            description.should.equal('Tracked Traits are listed in the Tracker.');
        });
    });
});

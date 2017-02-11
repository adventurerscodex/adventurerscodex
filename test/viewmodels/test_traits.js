'use strict';

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
            traitsViewModel.traits().length.should.equal(0);
            traitsViewModel.addTrait();
            traitsViewModel.traits().length.should.equal(1);
            traitsViewModel.removeTrait(traitsViewModel.traits().pop());
            traitsViewModel.traits().length.should.equal(0);
        });
        it('should remove a trait from the list of traits', function() {
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new Trait());
            var traitsViewModel = new TraitsViewModel();
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
            var traitsViewModel = new TraitsViewModel();

            traitsViewModel.previewTabStatus('');
            traitsViewModel.editTabStatus('active');
            traitsViewModel.modalFinishedClosing();
            traitsViewModel.previewTabStatus().should.equal('active');
            traitsViewModel.editTabStatus().should.equal('');
        });
        it('saves edited item', function() {
            var traitsViewModel = new TraitsViewModel();

            traitsViewModel.previewTabStatus('');
            traitsViewModel.editTabStatus('active');
            traitsViewModel.modalOpen(true);
            traitsViewModel.modalFinishedClosing();
            traitsViewModel.previewTabStatus().should.equal('active');
            traitsViewModel.editTabStatus().should.equal('');
        });
        it('saves edited item and tracked item', function() {
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new Trait());
            var traitsViewModel = new TraitsViewModel();

            traitsViewModel.previewTabStatus('');
            traitsViewModel.editTabStatus('active');
            traitsViewModel.modalOpen(true);
            traitsViewModel.currentEditItem(new Trait());
            traitsViewModel.currentEditItem().isTracked(true);
            traitsViewModel.currentEditTracked(new Tracked());
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
            traitsViewModel.sortBy('description');
            traitsViewModel.sort().should.equal(traitsViewModel.sorts['description asc']);
            traitsViewModel.sortBy('description');
            traitsViewModel.sort().should.equal(traitsViewModel.sorts['description desc']);
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

    describe('shortDescription', function() {
        it('should return short description', function() {
            var traitsViewModel = new TraitsViewModel();
            var trait = new Trait();
            trait.description('blah');
            simple.mock(Utility.markdown, 'asPlaintext').returnWith('blah');

            var description = traitsViewModel.shortDescription(trait);
            description.should.equal('blah');
        });
    });
});

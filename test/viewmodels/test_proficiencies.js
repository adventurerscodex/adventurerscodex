import {
    CharacterManager,
    DataRepository,
    Notifications
} from 'charactersheet/utilities';
import {
    PersistenceService,
    SortService
} from 'charactersheet/services/common';
import { MockCharacterManager } from '../mocks';
import { ProficienciesViewModel } from 'charactersheet/viewmodels/character/proficiencies';
import { Proficiency } from 'charactersheet/models/character';
import Should from 'should';
import simple from 'simple-mock';

describe('ProficienciesViewModel', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Add proficiency', function() {
        it('should add a new proficiency to the list of proficiencies', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var proficienciesViewModel = new ProficienciesViewModel();
            proficienciesViewModel.proficiencies().length.should.equal(0);
            proficienciesViewModel.addProficiency();
            proficienciesViewModel.proficiencies().length.should.equal(1);
        });
    });

    describe('Remove proficiency', function() {
        it('should remove a proficiency from the list of proficiencies', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var proficienciesViewModel = new ProficienciesViewModel();
            proficienciesViewModel.proficiencies().length.should.equal(0);
            proficienciesViewModel.addProficiency();
            proficienciesViewModel.proficiencies().length.should.equal(1);
            proficienciesViewModel.removeProficiency(proficienciesViewModel.proficiencies().pop());
            proficienciesViewModel.proficiencies().length.should.equal(0);
        });
    });

    describe('Edit proficiency', function() {
        it('should put a proficiency from the list of proficiencies into the selected slot', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var proficienciesViewModel = new ProficienciesViewModel();
            proficienciesViewModel.addProficiency();
            proficienciesViewModel.proficiencies().length.should.equal(1);
            proficienciesViewModel.editProficiency(proficienciesViewModel.proficiencies()[0]);
        });
    });

    describe('Load', function() {
        it('should load the saved list of proficiencies', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            simple.mock(PersistenceService, 'findBy').returnWith([new Proficiency()]);

            var proficienciesViewModel = new ProficienciesViewModel();
            proficienciesViewModel.proficiencies().length.should.equal(0);
            proficienciesViewModel.load();
            proficienciesViewModel.proficiencies().length.should.equal(1);
        });
    });

    describe('modalFinishedOpening', function() {
        it('perform actions after a modal has opened', function() {
            var proficienciesViewModel = new ProficienciesViewModel();

            proficienciesViewModel.shouldShowDisclaimer(false);
            proficienciesViewModel.firstModalElementHasFocus(false);
            proficienciesViewModel.modalFinishedOpening();
            proficienciesViewModel.shouldShowDisclaimer().should.equal(false);
            proficienciesViewModel.firstModalElementHasFocus().should.equal(true);
        });
    });

    describe('modalFinishedClosing', function() {
        it('perform actions after a modal has closed', function() {
            var proficienciesViewModel = new ProficienciesViewModel();

            proficienciesViewModel.previewTabStatus('');
            proficienciesViewModel.editTabStatus('active');
            proficienciesViewModel.modalFinishedClosing();
            proficienciesViewModel.previewTabStatus().should.equal('active');
            proficienciesViewModel.editTabStatus().should.equal('');
        });
    });

    describe('selectPreviewTab', function() {
        it('perform actions after the preview tab has been selected', function() {
            var proficienciesViewModel = new ProficienciesViewModel();

            proficienciesViewModel.previewTabStatus('');
            proficienciesViewModel.editTabStatus('active');
            proficienciesViewModel.selectPreviewTab();
            proficienciesViewModel.previewTabStatus().should.equal('active');
            proficienciesViewModel.editTabStatus().should.equal('');
        });
    });

    describe('selectEditTab', function() {
        it('perform actions after the preview tab has been selected', function() {
            var proficienciesViewModel = new ProficienciesViewModel();

            proficienciesViewModel.previewTabStatus('active');
            proficienciesViewModel.editTabStatus('');
            proficienciesViewModel.selectEditTab();
            proficienciesViewModel.previewTabStatus().should.equal('');
            proficienciesViewModel.editTabStatus().should.equal('active');
            proficienciesViewModel.editFirstModalElementHasFocus().should.equal(true);
        });
    });

    describe('Should set autocomplete fields', function() {
        it('should set the value of proficiency type when an autocomplete is selected', function() {
            var proficienciesViewModel = new ProficienciesViewModel();
            proficienciesViewModel.blankProficiency().name('Bagpipes');
            proficienciesViewModel.setType('label', 'Tools');

            proficienciesViewModel.blankProficiency().type().should.equal('Tools');
        });
    });

    describe('Sort By', function() {
        it('should sort the list of proficiencies by given criteria', function() {
            var proficienciesViewModel = new ProficienciesViewModel();
            proficienciesViewModel.sortBy('name');
            proficienciesViewModel.sort().should.equal(proficienciesViewModel.sorts['name desc']);
            proficienciesViewModel.sortBy('name');
            proficienciesViewModel.sort().should.equal(proficienciesViewModel.sorts['name asc']);
            proficienciesViewModel.sortBy('type');
            proficienciesViewModel.sort().should.equal(proficienciesViewModel.sorts['type asc']);
            proficienciesViewModel.sortBy('type');
            proficienciesViewModel.sort().should.equal(proficienciesViewModel.sorts['type desc']);
        });
    });

    describe('Sort Arrow', function() {
        it('should sort the list of proficiencies by given criteria', function() {
            var proficienciesViewModel = new ProficienciesViewModel();
            proficienciesViewModel.sortBy('name');
            proficienciesViewModel.sort().should.equal(proficienciesViewModel.sorts['name desc']);
            proficienciesViewModel.sortArrow('name').should.equal('fa fa-arrow-down fa-color');
            proficienciesViewModel.sortArrow('type').should.equal('');
            proficienciesViewModel.sortBy('name');
            proficienciesViewModel.sort().should.equal(proficienciesViewModel.sorts['name asc']);
            proficienciesViewModel.sortArrow('name').should.equal('fa fa-arrow-up fa-color');
            proficienciesViewModel.sortArrow('type').should.equal('');
        });
    });

    describe('Clear', function() {
        it('should clear all the values in proficiencies.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var proficienciesViewModel = new ProficienciesViewModel();
            var proficiencies = [new Proficiency()];

            proficienciesViewModel.addProficiency();
            proficienciesViewModel.proficiencies().length.should.equal(1);
            proficienciesViewModel.clear();
            proficienciesViewModel.proficiencies().length.should.equal(0);
        });
    });
});

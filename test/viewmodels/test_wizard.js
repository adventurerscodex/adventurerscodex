import {
    CharacterManager,
    Fixtures
} from 'charactersheet/utilities';
import {
    WizardAbilityScoresStepViewModel,
    WizardIntroStepViewModel,
    WizardProfileStepViewModel
} from 'charactersheet/viewmodels/common/wizard/steps';
import { Character } from 'charactersheet/models';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import Should from 'should';
import { WizardViewModel } from 'charactersheet/viewmodels/common/wizard';
import should from 'Should';
import simple from 'simple-mock';

describe('Wizard ViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Load', function() {
        it('should prime the first step', function() {
            var wizard = new WizardViewModel();
            var nextStepStub = simple.mock(wizard, 'getNextStep').callFn(function(){});
            var goForwardStub = simple.mock(wizard, 'goForward').callFn(function(){});

            nextStepStub.called.should.equal(false);
            goForwardStub.called.should.equal(false);

            wizard.load();

            nextStepStub.called.should.equal(true);
            goForwardStub.called.should.equal(true);
        });
    });

    describe('Should Show Start Button', function() {
        it('should determine if the user can start the creation proces (false)', function() {
            var wizard = new WizardViewModel();

            var result = wizard.shouldShowStartButton();
            result.should.equal(true);
        });
        it('should determine if the user can start the creation proces (true)', function() {
            var wizard = new WizardViewModel();
            wizard.previousSteps([1,2,4]);  // dummy values. It only checks length.

            var result = wizard.shouldShowStartButton();
            result.should.equal(false);
        });
    });
    describe('Should Show Back Button', function() {
        it('should determine if the user can go back (false)', function() {
            var wizard = new WizardViewModel();

            var result = wizard.shouldShowBackButton();
            result.should.equal(false);
        });
        it('should determine if the user can go back (true)', function() {
            var wizard = new WizardViewModel();
            wizard.previousSteps([1,2,4]); // dummy values. It only checks length.

            var result = wizard.shouldShowBackButton();
            result.should.equal(true);
        });
    });
    describe('Should Show Next Button', function() {
        it('should determine if the user can go forward (false)', function() {
            var wizard = new WizardViewModel();
            wizard.currentStep('WizardIntroStepViewModel');
            wizard.stepReady(false);

            var result = wizard.shouldShowNextButton();
            result.should.equal(false);
        });
        it('should determine if the user can go forward (true)', function() {
            var wizard = new WizardViewModel();
            var step = new WizardIntroStepViewModel({});
            wizard.stepReady(true);
            wizard.currentStep('WizardIntroStepViewModel');

            simple.mock(wizard, 'shouldShowFinishButton').returnWith(false);
            simple.mock(wizard, 'shouldShowStartButton').returnWith(false);

            var result = wizard.shouldShowNextButton();
            result.should.equal(true);
        });
    });
    describe('Should Show Finish Button', function() {
        it('should determine if the user can finish creation (false)', function() {
            var wizard = new WizardViewModel();
            wizard._isComplete(false);

            var result = wizard.shouldShowFinishButton();
            result.should.equal(false);
        });
        it('should determine if the user can finish creation (true)', function() {
            var wizard = new WizardViewModel();
            wizard._isComplete(true);

            var result = wizard.shouldShowFinishButton();
            result.should.equal(true);
        });
    });

    describe('Next Button', function() {
        it('should go forward', function() {
            var wizard = new WizardViewModel();
            var goForwardStub = simple.mock(wizard, 'goForward').callFn(function(){});

            goForwardStub.called.should.equal(false);

            wizard.nextButton();

            goForwardStub.called.should.equal(true);
        });
    });

    describe('Back Button', function() {
        it('should go backward', function() {
            var wizard = new WizardViewModel();
            var goBackwardStub = simple.mock(wizard, 'goBackward').callFn(function(){});

            goBackwardStub.called.should.equal(false);

            wizard.backButton();

            goBackwardStub.called.should.equal(true);
        });
    });

    describe('GoForward', function() {
        it('should advance to the next step, given one doesn\'t exists.', function() {
            var wizard = new WizardViewModel();
            var nextStepStub = simple.mock(wizard, 'nextStep').returnWith({
                viewModel: 'test'
            });
            var initializeStepStub = simple.mock(wizard, '_initializeStep').callFn(function(){});
            var previousStepsStub = simple.mock(wizard.previousSteps, 'push').callFn(function(){});

            nextStepStub.called.should.equal(false);
            initializeStepStub.called.should.equal(false);
            previousStepsStub.called.should.equal(false);

            wizard.goForward();

            nextStepStub.called.should.equal(true);
            initializeStepStub.called.should.equal(true);
            previousStepsStub.called.should.equal(false);
        });
        it('should advance to the next step, given one exists.', function() {
            var wizard = new WizardViewModel();
            var nextStepStub = simple.mock(wizard, 'nextStep').returnWith({
                viewModel: 'test'
            });
            var initializeStepStub = simple.mock(wizard, '_initializeStep').callFn(function(){});
            var previousStepsStub = simple.mock(wizard.previousSteps, 'push').callFn(function(){});

            nextStepStub.called.should.equal(false);
            initializeStepStub.called.should.equal(false);
            previousStepsStub.called.should.equal(false);

            wizard.currentStep({ viewModel: 'test' });
            wizard.goForward();

            nextStepStub.called.should.equal(true);
            initializeStepStub.called.should.equal(true);
            previousStepsStub.called.should.equal(true);
        });
    });

    describe('Terminate', function() {
        it('should change the active character.', function() {
            var changeStub = simple.mock(CharacterManager, 'changeCharacter').callFn(function(){});
            var stubChar = new Character();
            stubChar.key('1234');
            simple.mock(PersistenceService, 'findAll').returnWith([stubChar]);

            var wizard = new WizardViewModel();
            changeStub.called.should.equal(false);
            wizard.terminate();
            changeStub.called.should.equal(true);
        });
        it('should not change the active character.', function() {
            // Test no chars.
            var changeStub = simple.mock(CharacterManager, 'changeCharacter');
            simple.mock(PersistenceService, 'findAll').returnWith([]);
            changeStub.called.should.equal(false);

            var wizard = new WizardViewModel();
            wizard.terminate();

            changeStub.called.should.equal(false);
        });
    });

    describe('Determine Step After Step', function() {
        it('should determine the next step given a null current step and results.', function() {
            var wizard = new WizardViewModel();
            var step = wizard._determineStepAfterStep(null);
            step.terminate.should.equal(false);
            Should.exist(step.viewModel);
        });

        it('should determine the next step given an "import" intro step.', function() {
            var wizard = new WizardViewModel();
            wizard.stepResult({import: 'charId'});
            var step = wizard._determineStepAfterStep('WizardIntroStep');
            step.terminate.should.equal(true);
            Should.not.exist(step.viewModel);
        });
        it('should determine the next step given a "player" intro step.', function() {
            var wizard = new WizardViewModel();
            wizard.stepResult({ 'PlayerType': 'player'});
            var step = wizard._determineStepAfterStep('WizardIntroStep');
            step.terminate.should.equal(false);
            Should.exist(step.viewModel);
        });
        it('should determine the next step given an incorrect intro step.', function() {
            var wizard = new WizardViewModel();
            wizard.stepResult({ 'PlayerTypo': 'player'});

            try {
                wizard._determineStepAfterStep('WizardIntroStep');
                (true).should.equal(false);
            } catch(err) {
                (true).should.equal(true);
            }
        });

        it('should determine the next step given a profile step.', function() {
            var wizard = new WizardViewModel();
            var step = wizard._determineStepAfterStep('WizardProfileStep');
            step.terminate.should.equal(false);
            step.viewModel.should.equal('WizardAbilityScoresStep');
        });

        it('should do nothing given an incorrect current step.', function() {
            var wizard = new WizardViewModel();
            var step = wizard._determineStepAfterStep('Not A Step');
            Should.not.exist(step);
        });

        // Ability Scores

        it('should move forward given an correct current step.', function() {
            var wizard = new WizardViewModel();
            var currentStep = new WizardAbilityScoresStepViewModel({});
            simple.mock(currentStep, 'results').callFn(function() {});
            currentStep.IDENTIFIER = 'SOME INVALID ID';

            var step = wizard._determineStepAfterStep(currentStep);
            Should.not.exist(step);
        });
    });
});

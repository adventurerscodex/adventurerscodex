'use strict';

/**
 * This view model contains the root implementation of the wizard.
 * Each individual view inside the wizard must conform to the following
 * list of properties and methods in order to be presented by the wizard.
 *
 *  WizardStepViewModels
 *      - ready { must be callable and return true/false } Indicates
 *      whether or not the view model has the required data.
 *      - results { an array-like object of results } Should contain the
 *      relevant results in order to determine the next step.
 *
 * This view model uses the above properties to determine how/when to allow
 * the user to move through the process.
 *
 * To add steps: add an entry to the Fixtures.wizard.steps settings.
 *
 */
function WizardViewModel() {
    var self = this;

    self.previousSteps = ko.observableArray([]);
    self.currentStep = ko.observable(null);
    self.nextStep = ko.observable(null);

    /**
     * A marker than the wizard is complete and that the
     * finish button should be visible.
     */
    self._isComplete = ko.observable(false);

    self._currentStepReadySubscription = null;

    // View Model Methods

    self.init = function() { };

    self.load = function() {
        self.getNextStep();
        self.goForward();
    };

    self.unload = function() {
        self.reset();
    };

    // Step Management Methods

    /**
     * If possible, progresses to the next step. The method also pushes the
     * previous step onto the list of previous steps.
     */
    self.goForward = function() {
        var nextStepDescriptor = self.nextStep();
        // Don't push empty steps.
        if (self.currentStep()) {
            self.previousSteps.push(self.currentStep());
        }

        self.currentStep(nextStepDescriptor.viewModel);
        self._initializeStep(self.currentStep());
    };

    /**
     * If possible, reverts the steps by 1. This method allows the
     * current step to unload before loading the previous step.
     * **Warning** This method wil destroy any information saved
     * on the current step.
     */
    self.goBackward = function() {
        // In case it's the final step, clear the flag.
        if (self._isComplete()) { self._isComplete(false); }
        if (self.previousSteps().length === 0) { return; }

        self._deinitializeStep(self.currentStep());

        var previousStep = self.previousSteps.pop();
        self.currentStep(previousStep);

        self._initializeStep(self.currentStep());
        self.getNextStep();
    };


    /**
     * Fetches the next step based on the results of the current step,
     * and initializes that step.
     *
     * Side effect: If no next step exists, the _isComplete attribute
     * is set to true.
     *
     * Side effect: If a step should cause the wizard to terminate, then
     * the it is immediately done.
    */
    self.getNextStep = function() {
        // Do not progress if the step isn't ready.
        if (self.currentStep() && !self.currentStep().ready()) { return; }

        var nextStepDescriptor = self._determineStepAfterStep(self.currentStep());
        if (!nextStepDescriptor.viewModel) {
            self._isComplete(true);
        }
        if (nextStepDescriptor.terminate) {
            self.terminate();
            return;
        }
        self.nextStep(nextStepDescriptor);
    };

    /**
     * When called, immediately terminate the wizard and notify the
     * system of successful completion.
     */
    self.terminate = function() {
        // Newest character will be at the back.
        //Notifications.wizard.completed.dispatch();
        var character = Character.findAll().reverse()[0];
        if (character) {
            CharacterManager.changeCharacter(character.key());
        }
    };

    /**
     * Resets the wizard back to the first step.
     */
    self.reset = function() {
        self.previousSteps([]);
        self.currentStep(null);
        self.nextStep(null);
        self._isComplete(false);
        self._currentStepReadySubscription = null;

        self.getNextStep();
        self.goForward();
    };

    /**
     * Progress through all previous and current steps and save their data.
     */
    self.save = function() {
        var character = new Character();
        character.key(uuid.v4());
        character.save();

        var typeStepViewModel = self.allSteps().filter(function(step, idx, _) {
            return step.IDENTIFIER === 'WizardPlayerTypeStep';
        })[0];

        var playerType = typeStepViewModel.results().playerType;
        character.playerType(playerType);
        character.save();

        if (playerType.key == 'character') {
            // Profile

            var profile = new Profile();
            var profileStepViewModel = self.allSteps().filter(function(step, idx, _) {
                return step.IDENTIFIER === 'WizardProfileStep';
            });

            var data = profileStepViewModel[0].results();
            data.characterId = character.key();
            profile.importValues(data);
            profile.save();

            var playerInfo = new PlayerInfo();
            playerInfo.characterId(character.key());
            playerInfo.save();

            // Ability Scores

            var abilityScoresStepViewModel = self.allSteps().filter(function(step, idx, _) {
                return step.IDENTIFIER === 'WizardAbilityScoresStep';
            });

            var abilityScores = new AbilityScores();
            var abData = abilityScoresStepViewModel[0].results();
            abData.characterId = character.key();
            abilityScores.importValues(abData);
            abilityScores.save();
        } else if (playerType.key == 'dm') {
            // Campaign

            var campaign = new Campaign();
            var campaignStep = self.allSteps().filter(function(step, idx, _) {
                return step.IDENTIFIER === 'WizardCampaignStep';
            });

            data = campaignStep[0].results();
            campaign.characterId = character.key();
            campaign.playerName(data.playerName);
            campaign.name(data.campaignName);
            campaign.createdDate(new Date());
            campaign.save();
        }
        //TODO: Save the results of all child steps.
    };

    // UI Helper Methods

    self.shouldShowStartButton =  ko.pureComputed(function() {
        return self.previousSteps().length === 0;
    });

    self.shouldShowNextButton = ko.pureComputed(function() {
        return self.currentStep()
            && self.currentStep().ready()
            && !self.shouldShowFinishButton()
            && !self.shouldShowStartButton();
    });

    self.shouldShowBackButton = ko.pureComputed(function() {
        return self.previousSteps().length != 0;
    });

    self.shouldShowFinishButton = ko.pureComputed(function() {
        return self._isComplete();
    });

    // Button Methods

    self.nextButton = function() {
        self.goForward();
    };

    self.backButton = function() {
        self.goBackward();
    };

    self.finishButton = function() {
        self.save();
        self.terminate();
        self.reset();
    };

    // Private Methods

    self._initializeStep = function(step) {
        //Set the determination to occur when the current step is deemed ready.
        self._currentStepReadySubscription = step.ready.subscribe(self.getNextStep);

        step.init();
        step.load();
    };

    self._deinitializeStep = function(step) {
        step.unload();
        self._currentStepReadySubscription.dispose();
    };

    self.allSteps = function() {
        return self.previousSteps().concat([self.currentStep()]);
    };

    /**
     * Given a step use it's results to determine the next step in the sequence.
     *
     * @params currentStep {viewModel} The current view model object.
     * @returns {NextStepDescriptor} Returns a descriptor of what to do next.
     */
    self._determineStepAfterStep = function(currentStep) {
        var nextStep = null;
        if (!currentStep) {
            return new NextStepDescriptor(new WizardIntroStepViewModel(), false);
        }

        var results = currentStep.results();
        if (currentStep.IDENTIFIER === 'WizardIntroStep') {
            if (results['import']) {
                return new NextStepDescriptor(null, true);
            } else if (results['PlayerType'] === 'player') {
                return new NextStepDescriptor(new WizardPlayerTypeStepViewModel(), false);
            } else {
                throw 'Assertion Failure: Unknown Result Type';
            }
        }

        if (currentStep.IDENTIFIER === 'WizardPlayerTypeStep') {
            if (results.playerType.key === 'character') {
                return new NextStepDescriptor(new WizardProfileStepViewModel(), false);
            } else {
                return new NextStepDescriptor(new WizardCampaignStepViewModel(), false);
            }
        }

        if (currentStep.IDENTIFIER === 'WizardProfileStep') {
            return new NextStepDescriptor(new WizardAbilityScoresStepViewModel(), false);
        }

        if (currentStep.IDENTIFIER === 'WizardAbilityScoresStep') {
            return new NextStepDescriptor(null, false);
        }

        if (currentStep.IDENTIFIER === 'WizardCampaignStep') {
            return new NextStepDescriptor(null, false);
        }

        //TODO Add more steps here.
    };
}


/**
 * This model describes the next step to be taken and the various options
 * that are allowed.
 *
 * @param viewModel {object or null} an step view model to progress to if provided.
 * @param terminate {boolean} whether or not to terminate the wizard and return to
 * the main application.
 */
function NextStepDescriptor(viewModel, terminate) {
    this.viewModel = viewModel || null;
    this.terminate = terminate || false;
}

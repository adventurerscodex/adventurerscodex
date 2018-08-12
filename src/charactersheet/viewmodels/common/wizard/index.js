import { AbilityScore } from 'charactersheet/models';
import { CoreManager } from 'charactersheet/utilities';
import { Hypnos } from 'hypnos/lib/hypnos';
import ko from 'knockout';
import template from './index.html';
import uuid from 'node-uuid';

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
export function WizardViewModel() {
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
    self.stepReady = ko.observable(false);
    self.aggregateResults = ko.observable({});
    self.stepResult = ko.observable({});
    self.newCharacterId = null;

    // Seed Data
    self.defaultSavingThrows = [
        {'name': 'Strength', 'proficiency': false, 'modifier': 0, 'abilityScore': 'STR'},
        {'name': 'Dexterity', 'proficiency': false, 'modifier': 0, 'abilityScore': 'DEX'},
        {'name': 'Constitution', 'proficiency': false, 'modifier': 0, 'abilityScore': 'CON'},
        {'name': 'Intelligence', 'proficiency': false, 'modifier': 0, 'abilityScore': 'INT'},
        {'name': 'Wisdom', 'proficiency': false, 'modifier': 0, 'abilityScore': 'WIS'},
        {'name': 'Charisma', 'proficiency': false, 'modifier': 0, 'abilityScore': 'CHA'}
    ];

    self.defaultSkills = [
        {'name': 'Acrobatics', 'abilityScore': 'DEX', 'modifier': 0, 'proficiency': 'not'},
        {'name': 'Animal Handling', 'abilityScore': 'WIS', 'modifier': 0, 'proficiency': 'not'},
        {'name': 'Arcana', 'abilityScore': 'INT', 'modifier': 0, 'proficiency': 'not'},
        {'name': 'Athletics', 'abilityScore': 'STR', 'modifier': 0, 'proficiency': 'not'},
        {'name': 'Deception', 'abilityScore': 'CHA', 'modifier': 0, 'proficiency': 'not'},
        {'name': 'History', 'abilityScore': 'INT', 'modifier': 0, 'proficiency': 'not'},
        {'name': 'Insight', 'abilityScore': 'WIS', 'modifier': 0, 'proficiency': 'not'},
        {'name': 'Intimidation', 'abilityScore': 'CHA', 'modifier': 0, 'proficiency': 'not'},
        {'name': 'Investigation', 'abilityScore': 'INT', 'modifier': 0, 'proficiency': 'not'},
        {'name': 'Medicine', 'abilityScore': 'WIS', 'modifier': 0, 'proficiency': 'not'},
        {'name': 'Nature', 'abilityScore': 'INT', 'modifier': 0, 'proficiency': 'not'},
        {'name': 'Perception', 'abilityScore': 'WIS', 'modifier': 0, 'proficiency': 'not'},
        {'name': 'Performance', 'abilityScore': 'CHA', 'modifier': 0, 'proficiency': 'not'},
        {'name': 'Persuasion', 'abilityScore': 'CHA', 'modifier': 0, 'proficiency': 'not'},
        {'name': 'Religion', 'abilityScore': 'INT', 'modifier': 0, 'proficiency': 'not'},
        {'name': 'Sleight of Hand', 'abilityScore': 'DEX', 'modifier': 0, 'proficiency': 'not'},
        {'name': 'Stealth', 'abilityScore': 'DEX', 'modifier': 0, 'proficiency': 'not'},
        {'name': 'Survival', 'abilityScore': 'WIS', 'modifier': 0, 'proficiency': 'not'}
    ];

    // View Model Methods

    self.init = function() { };

    self.load = function() {
        CoreManager.setActiveCoreFragment(null);

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
        if (self.currentStep() && !self.stepReady()) {
            // Steps can be made "unready".
            self._isComplete(false);
            return;
        }

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

    self.saveStepResult = function() {
        self.aggregateResults()[self.currentStep()] = self.stepResult();
    };

    /**
     * When called, immediately terminate the wizard and notify the
     * system of successful completion.
     */
    self.terminate = function() {
        // Newest character will be at the back.
        // var character = PersistenceService.findAll(Character).reverse()[0];
        // if (character) {
        CoreManager.changeCore(self.newCharacterId);
        // }
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
    };

    /**
     * Progress through all previous and current steps and save their data.
     */
    self.save = async function() {
        var playerType = self.aggregateResults()['WizardPlayerTypeStep'].playerType;
        let params = {};
        let actions;

        if (playerType.key == 'character') {
            actions = ['core', 'characters', 'create'];

            // Profile
            var profileData = self.aggregateResults()['WizardProfileStep'];
            params.playerName = profileData.playerName;
            params.profile = self.createProfileFromData(profileData);

            // Ability Scores
            var abilityScoresData = self.aggregateResults()['WizardAbilityScoresStep'];
            params.abilityScores = abilityScoresData;

            // Saving Throws
            params.savingThrows = self.defaultSavingThrows;

            // Skills
            params.skills = self.defaultSkills;

            // Background
            params.background = {
                name: profileData.background ? profileData.background : '',
                flaw: '',
                bond: '',
                ideal: '',
                personalityTrait: ''
            };

            // Profile image
            params.profileImage = { type: 'email' };

            // Health
            params.health = { maxHitPoints: 10 };

            // TODO: Wait for API update for this to be refactored

            // // Pre populate traits by race
            // var traits = data.traits;
            // traits.forEach(function (item, idx, _){
            //     var trait = new Trait();
            //     item.characterId = character.key();
            //     trait.importValues(item);
            //     trait.save();
            // });

            // // Pre populate items by backpack
            // var items = data.items;
            // items.forEach(function (element, idx, _){
            //     var item = new Item();
            //     element.characterId = character.key();
            //     item.importValues(element);
            //     item.save();
            // });
        } else if (playerType.key == 'dm') {
            // Campaign
            actions = ['core', 'dms', 'create'];

            let campaignData = self.aggregateResults()['WizardCampaignStep'];
            params.profileImage = { type: 'email' };
            params.playerName = campaignData.playerName;
            params.campaign = {
                name: campaignData.campaignName
            };
        }

        // Save the core data and set the new character
        const coreResponse = await Hypnos.client.action(actions, params);
        self.newCharacterId = coreResponse.data.uuid;
    };

    self.createProfileFromData = (data) => {
        let profile = {};
        profile.characterName = data.characterName;
        profile.background = data.background;
        profile.race = data.race;
        profile.characterClass = data.typeClass;
        profile.age = data.age;
        profile.alignment = data.alignment;
        profile.gender = data.gender;
        profile.deity = data.deity;
        profile.level = data.level;
        profile.experience = data.exp;

        return profile;
    };

    self.createAbilityScoresFromData = (data) => {
        let abilityScores = [];
        data.forEach(element => {
            let abilityScore = new AbilityScore();
            abilityScore.name(element.name);
            abilityScore.value(element.value);
            abilityScore.shortName(element.shortName);
            abilityScores.push(abilityScore);
        });

        return abilityScores;
    };

    // UI Helper Methods

    self.shouldShowStartButton = ko.pureComputed(function() {
        return self.previousSteps().length === 0;
    });

    self.shouldShowNextButton = ko.pureComputed(function() {
        return self.currentStep()
            && self.stepReady()
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
        self.saveStepResult();
        self.goForward();
        self.stepReady(false);
    };

    self.backButton = function() {
        self.stepReady(false);
        self.goBackward();
    };

    self.finishButton = async function() {
        self.saveStepResult();
        await self.save();
        self.terminate();
        self.reset();
    };

    // Private Methods

    self._initializeStep = function(step) {
        //Set the determination to occur when the current step is deemed ready.
        self._currentStepReadySubscription = self.stepReady.subscribe(self.getNextStep);
    };

    self._deinitializeStep = function(step) {
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
            return new NextStepDescriptor('WizardIntroStep', false);
        }

        var results = self.stepResult();
        if (currentStep === 'WizardIntroStep') {
            if (results['import']) {
                return new NextStepDescriptor(null, true);
            } else if (results['PlayerType'] === 'player') {
                return new NextStepDescriptor('WizardPlayerTypeStep', false);
            } else {
                throw 'Assertion Failure: Unknown Result Type';
            }
        }

        if (currentStep === 'WizardPlayerTypeStep') {
            if (results.playerType.key === 'character') {
                return new NextStepDescriptor('WizardProfileStep', false);
            } else {
                return new NextStepDescriptor('WizardCampaignStep', false);
            }
        }

        if (currentStep === 'WizardProfileStep') {
            return new NextStepDescriptor('WizardAbilityScoresStep', false);
        }

        if (currentStep === 'WizardAbilityScoresStep') {
            return new NextStepDescriptor(null, false);
        }

        if (currentStep === 'WizardCampaignStep') {
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

ko.components.register('wizard', {
    viewModel: WizardViewModel,
    template: template
});

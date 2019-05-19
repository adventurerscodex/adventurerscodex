import 'bin/popover_bind';
import {
    AbilityScore,
    SavingThrow
} from 'charactersheet/models/character';

import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';

import { find } from 'lodash';

import ko from 'knockout';
import template from './form.html';

class ACFormViewModel {
    constructor(params) {
        // Card Properties
        this.containerId = ko.utils.unwrapObservable(params.containerId);
        this.showBack = params.showBack;
        this.flip = params.flip;

        this.loaded = ko.observable(false);
        this.formElementHasFocus = ko.observable(false);
    }

    async load() {
        this.loaded(false);
        await this.refresh();
        this.setUpSubscriptions();
        this.loaded(true);
    }

    async reset() {
        await this.refresh();
        this.setUpSubscriptions();
        this.flip();
    }

    dispose() {
        console.error('Dispose must be implemented');
    }

    async refresh() {
        throw('refresh must be defined by subclasses of ACFormViewModel');
    }

    async save() {
        throw('Save must be defined by subclasses of ACFormViewModel');
    }

    async notify() {
        throw('Notify must be defined by subclasses of ACFormViewModel');
    }

    async submit() {
        await this.save();
        this.notify();
        this.setUpSubscriptions();
        this.flip();
    }

    setUpSubscriptions() {
        this.showBack.subscribe(this.subscribeToShowForm);
    }

    subscribeToShowForm = () => {
        if (this.showBack()) {
            this.refresh();
            this.formElementHasFocus(true);
        } else {
            this.formElementHasFocus(false);
        }
    }
}

export class ScoreSaveFormViewModel extends ACFormViewModel {
    constructor(params) {
        super(params);
        this.order = params.order;
        this.forceCardResize = params.forceCardResize;
        this.showSaves = ko.observable(false);
        this.abilityScores = ko.observableArray([]);
        this.savingThrows = ko.observableArray([]);
        this.abilityScoresChanged = ko.observable(false);
        this.savingThrowsChanged = ko.observable(false);
    }

    watchSavingThrows = () => {
        this.savingThrowsChanged(true);
    }

    watchAbilityScores = () => {
        this.abilityScoresChanged(true);
    }

    saveFormHasFocus = ko.computed(()=>(this.formElementHasFocus() && this.showSaves()), this);
    scoreFormHasFocus = ko.computed(()=>(this.formElementHasFocus() && !this.showSaves()), this);

    abilityScoresChanged = ko.computed(()=> {})
    toggleSaves = (newValue) => {
        this.showSaves(!this.showSaves());
        this.forceCardResize();
    };

    findSaveByName = (name) => find(this.savingThrows(), (savingthrow) => savingthrow().name() === name);

    findScoreByName = (name) => find(this.abilityScores(), (score) => score().name() === name);

    refresh = async () => {
        const key = CoreManager.activeCore().uuid();
        const scores = await AbilityScore.ps.list({coreUuid: key});
        const saves = await SavingThrow.ps.list({coreUuid: key});
        this.abilityScores(scores.objects.map(score => ko.observable(score)));
        this.savingThrows(saves.objects.map(savingThrow => ko.observable(savingThrow)));
        this.resetSubscriptions();
    };

    save = async () => {
        if (this.savingThrowsChanged()) {
            const saves = this.savingThrows().map(async (savingThrow) => {
                // save each save in place.
                await savingThrow().ps.save();
            });
            await Promise.all(saves);
        }
        if (this.abilityScoresChanged()) {
            const scores = this.abilityScores().map(async (abilityScore) => {
                // save each save in place.
                await abilityScore().ps.save();
            });
            await Promise.all(scores);
        }
    }

    notify = () => {
        if (this.abilityScoresChanged()) {
            Notifications.abilityScores.dexterity.changed.dispatch();
            Notifications.abilityScores.intelligence.changed.dispatch();
            Notifications.abilityScores.changed.dispatch();
        }
        this.resetSubscriptions();
    }


    resetSubscriptions = () => {
        this.abilityScoresChanged(false);
        this.savingThrowsChanged(false);
    }

    validation = {
    //     submitHandler: (form, event) => {
    //         event.preventDefault();
    //         self.modalFinishedClosing();
    //     },
    //     updateHandler: ($element) => {
    //         self.addFormIsValid($element.valid());
    //     },
        ...AbilityScore.validationConstraints,
        ...SavingThrow.validationConstraints
    }
}

ko.components.register('score-save-form', {
    viewModel: ScoreSaveFormViewModel,
    template: template
});

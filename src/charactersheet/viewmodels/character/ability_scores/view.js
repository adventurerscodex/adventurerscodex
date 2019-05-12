import 'bin/knockout-bootstrap-modal';
import { CoreManager, Notifications } from 'charactersheet/utilities';
import { filter, find, includes } from 'lodash';
import { AbilityScore } from 'charactersheet/models/character/ability_score';
import { SavingThrow } from 'charactersheet/models/character';

import ko from 'knockout';
import template from './view.html';

class ACViewModel {
    constructor(params) {
        // Card Properties
        this.containerId = ko.utils.unwrapObservable(params.containerId);
        this.showBack = params.showBack;
        this.flip = params.flip;

        this.loaded = ko.observable(false);
    }

    async load() {
        this.loaded(false);
        await this.refresh();
        this.setUpSubscriptions();
        this.loaded(true);
    }

    async refresh() {
        throw('refresh must be defined by subclasses of ACViewModel');
    }

    setUpSubscriptions() {
        this.showBack.subscribe(this.subscribeToShowForm);
    }

    subscribeToShowForm = () => {
        if (!this.showBack()) {
            this.refresh();
        }
    }
}

class ScoreSaveViewModel extends ACViewModel {
    constructor(params) {
        super(params);
        this.order = params.order;
        this.abilityScores = ko.observableArray([]);
        this.savingThrows = ko.observableArray([]);
    }

    refresh = async () => {
        const key = CoreManager.activeCore().uuid();
        const scores = await AbilityScore.ps.list({coreUuid: key});
        const saves = await SavingThrow.ps.list({coreUuid: key});
        this.abilityScores(scores.objects.map(score => ko.observable(score)));
        this.savingThrows(saves.objects.map(savingThrow => ko.observable(savingThrow)));
        // Calculate Initial Values
        this.updateSavingThrowValues();
    };

    updateSavingThrowValues = async () => {
        // By telling each savingThrow to update their labels, we're implicitly
        // making a networking call. This should not be this way, but because
        // the fix is too time consuming, at time of writing, I'm just leaving
        // it and documenting the weirdness.
        for (const savingThrow of this.savingThrows()) {
            await savingThrow().updateModifierLabel();
        }
    };

    setUpSubscriptions() {
        super.setUpSubscriptions();
        // abilityScore changes not needed, as the card flip should be enough
        // Notifications.abilityScores.changed.add(this.updateSavingThrowValues);
        Notifications.proficiencyBonus.changed.add(this.updateSavingThrowValues);
    }

    findSaveByName = (name) => find(this.savingThrows(), (savingthrow) => savingthrow().name() === name);
    findScoreByName = (name) => find(this.abilityScores(), (score) => score().name() === name);
}

ko.components.register('ability-scores-saving-throws-view', {
    viewModel: ScoreSaveViewModel,
    template: template
});

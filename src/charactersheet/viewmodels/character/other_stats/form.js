import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';

import {
    OtherStats,
    Profile
} from 'charactersheet/models/character';

import ko from 'knockout';
import template from './form.html';


class ACFormViewModel {
    constructor(params) {
        // Card Properties
        this.containerId = ko.utils.unwrapObservable(params.containerId);
        this.showForm = params.showForm;
        this.flip = params.flip;
        this.resize = params.resize;

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
        this.showForm.subscribe(this.subscribeToShowForm);
    }

    subscribeToShowForm = () => {
        if (this.showForm()) {
            this.refresh();
            this.formElementHasFocus(true);
        } else {
            this.formElementHasFocus(false);
        }
    }
}

export class OtherStatsFormViewModel extends ACFormViewModel {
    constructor(params) {
        super(params);
        this.otherStats = ko.observable(new OtherStats());
        this.profile = ko.observable(new Profile());

        // Notification Properties
        this.hasProficiencyChanged = ko.observable(false);
        this.hasInspirationChanged = ko.observable(false);
        this.hasInitiativeChanged = ko.observable(false);
        this.hasAcChanged = ko.observable(false);
        this.hasLevelChanged = ko.observable(false);
        this.hasExperienceChanged = ko.observable(false);

    }

    validation = {
        rules : {
            // Deep copy of properties in object
            ...Profile.validationConstraints.rules,
            ...OtherStats.validationConstraints.rules
        }
    }

    toggleInspiration = async () => {
        this.otherStats().inspiration(!this.otherStats().inspiration());
    }

    refresh = async () => {
        const key = CoreManager.activeCore().uuid();
        const otherStats = await OtherStats.ps.read({uuid: key});
        const profile = await Profile.ps.read({uuid: key});
        this.otherStats(otherStats.object);
        this.profile(profile.object);
        this.resetSubscriptions();
    }

    save = async () => {
        // Do not call directly unless you know what you're doing. Call submit.
        const otherStatsResponse = await this.otherStats().ps.save();
        const profileResponse = await this.profile().ps.save();
        this.otherStats(otherStatsResponse.object);
        this.profile(profileResponse.object);
    }

    notify = async () => {
        if (this.hasInspirationChanged()) {
            Notifications.otherStats.inspiration.changed.dispatch();
        }
        if (this.hasAcChanged()) {
            Notifications.stats.armorClassModifier.changed.dispatch();
        }
        if (this.hasLevelChanged()) {
            Notifications.profile.level.changed.dispatch();
        }
        if (this.hasExperienceChanged()) {
            Notifications.profile.experience.changed.dispatch();
        }
        if (this.hasProficiencyChanged()) {
            Notifications.otherStats.proficiency.changed.dispatch();
        }
        this.resetSubscriptions();
    }

    setUpSubscriptions = () => {
        super.setUpSubscriptions();
        // Subscribe to the fields changing so that the correct notifications
        // are fired when saving.
        this.otherStats().proficiencyModifier.subscribe(this.proficiencyHasChanged);
        this.otherStats().inspiration.subscribe(this.inspirationHasChanged);
        this.otherStats().initiativeModifier.subscribe(this.initiativeHasChanged);
        this.otherStats().armorClassModifier.subscribe(this.armorClassModifierDataHasChanged);
        this.profile().level.subscribe(this.levelDataHasChanged);
        this.profile().experience.subscribe(this.experienceDataHasChanged);
    }

    // Functions to record that fields have changed. These values are reset on save (or reset)
    inspirationHasChanged = () => {
        this.hasInspirationChanged(true);
    }
    initiativeHasChanged = () => {
        this.hasInitiativeChanged(true);
    }
    armorClassModifierDataHasChanged = () => {
        this.hasAcChanged(true);
    }
    levelDataHasChanged = () => {
        this.hasLevelChanged(true);
    }
    experienceDataHasChanged = () => {
        this.hasExperienceChanged(true);
    }
    proficiencyHasChanged = () => {
        this.hasProficiencyChanged(true);
    }

    resetSubscriptions = () => {
        this.hasInspirationChanged(false);
        this.hasAcChanged(false);
        this.hasLevelChanged(false);
        this.hasExperienceChanged(false);
        this.hasProficiencyChanged(false);
        this.hasInitiativeChanged(false);
    }
}

ko.components.register('other-stats-form', {
    viewModel: OtherStatsFormViewModel,
    template: template
});

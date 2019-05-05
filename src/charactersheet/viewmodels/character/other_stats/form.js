import 'bin/popover_bind';
import {
    AbilityScore,
    OtherStats,
    Profile
} from 'charactersheet/models/character';
import {
    ArmorClassService,
    ProficiencyService
} from 'charactersheet/services';
import {
    CoreManager,
    Fixtures,
    Notifications
} from 'charactersheet/utilities';

import { FormComponentViewModel } from 'charactersheet/components';
import { getModifier } from 'charactersheet/models/character/ability_score';
import ko from 'knockout';
import template from './form.html';


//extends FormComponentViewModel
export class OtherStatsFormViewModel  {
    constructor(params) {
        this.data = ko.utils.unwrapObservable(params.data);
        // Actions
        this.save = params.saveAction;
        this.reset = params.cancelAction;

        // Card Properties
        this.showForm = params.showForm;
        this.flip = params.flip;
        this.resize = params.resize;

        this.add = params.add;
        this.remove = params.remove;

        this.containerId = ko.utils.unwrapObservable(params.containerId);

        this.currentEditItem = ko.observable();

        this.formElementHasFocus = ko.observable(false);

        this.addForm = ko.observable(false);
      // this.bypassUpdate = ko.observable(false);
      // this.shouldShowDisclaimer = ko.observable(false);
    }

    generateBlank = () => ({
        profile: new Profile(),
        otherStats: new OtherStats()
    });

    notify = () => {
        throw('you must provide a notification system');
    }

    subscribeToShowForm = () => {
      // if (this.showForm()) {
      //     if (this.data) {
      //         this.reset();
      //         this.currentEditItem().importValues(this.data.exportValues());
      //     }
      //     this.formElementHasFocus(true);
      // } else {
      //     this.formElementHasFocus(false);
      //     if (this.bypassUpdate()) {
      //         this.bypassUpdate(false);
      //     } else {
      //         this.update();
      //     }
      //     this.reset();
      // }
    }

    load = () => {
      // this.reset();
      // if (this.data) {
      //     this.currentEditItem().importValues(this.data.exportValues());
      // } else {
      //     this.addForm(true);
      // }
      //
      // this.showForm.subscribe(this.subscribeToShowForm);
      //
      // this.shouldShowDisclaimer.subscribe(()=> {
      //     setTimeout(this.resizeCallback, 1);
      // });
    }

    update = () => {
      // if (this.data) {
      //     this.data.importValues(this.currentEditItem().exportValues());
      //     this.data.save();
      // } else {
      //     this.addCallback(this.currentEditItem());
      // }
      // this.notify();
    }

    //save = () => {
      // this.bypassUpdate(true);
      // this.update();
      // this.toggle();
      // this.reset();
    //}

    cancel = (data, event) => {
      // this.bypassUpdate(true);
      // this.toggle();
      // this.reset();
    }

    // reset = () => {
      // this.shouldShowDisclaimer(false);
      // this.currentEditItem(this.generateBlank());
    // }

    remove = () => {
      // $(`#${this.containerId}`).collapse('hide');
      // setTimeout(() => {
      //     this.removeCallback(this.data);
      //     this.notify();
      // }, 650);
    }


    // constructor(params) {
    //     super(params);
    //     this.otherStats = ko.observable(new OtherStats());
    //     this.profile = ko.observable(new Profile());
    //     this.armorClass = ko.observable();
    //     this.level = ko.observable('');
    //     this.experience = ko.observable('');
    //     this.proficiencyLabel = ko.observable();
    //     this.initiativeLabel = ko.observable();
    //     this.initiativePopover = ko.observable();
    //     this.proficiencyPopover = ko.observable();
    //     this.armorClassPopover = ko.observable();
    //
    //     this.hasProficiencyChanged = ko.observable(false);
    //     this.hasInspirationChanged = ko.observable(false);
    //     this.hasInitiativeChanged = ko.observable(false);
    //     this.hasAcChanged = ko.observable(false);
    //     this.hasLevelChanged = ko.observable(false);
    //     this.hasExperienceChanged = ko.observable(false);
    //
    //     this.validation = {
    //         rules : {
    //             // Deep copy of properties in object
    //             ...Profile.validationConstraints.rules,
    //             ...OtherStats.validationConstraints.rules
    //         }
    //     };
    // }

    load = async () => {
        // this.loaded(false);
        // await this.reset();
        //
        // this.calculateInitiativeLabel();
        // this.updateArmorClass();
        // this.calculatedProficiencyLabel();
        //
        // // Subscriptions
        // this.setUpModelSubscriptions();
        // this.monitorSubscriptions();
    }

    monitorSubscriptions = () => {
        // Notifications.armorClass.changed.add(this.updateArmorClass);
        // Notifications.abilityScores.dexterity.changed.add(this.calculateInitiativeLabel);
        // Notifications.proficiencyBonus.changed.add(this.calculatedProficiencyLabel);
    }

    setUpModelSubscriptions = () => {
        // this.otherStats().proficiencyModifier.subscribe(this.proficiencyHasChanged);
        // this.otherStats().inspiration.subscribe(this.inspirationHasChanged);
        // this.otherStats().initiativeModifier.subscribe(this.initiativeHasChanged);
        // this.otherStats().armorClassModifier.subscribe(this.armorClassModifierDataHasChanged);
        // this.profile().level.subscribe(this.levelDataHasChanged);
        // this.profile().experience.subscribe(this.experienceDataHasChanged);
    }


    // inspirationHasChanged = () => {
    //     this.hasInspirationChanged(true);
    // }
    //
    // initiativeHasChanged = () => {
    //     this.hasInitiativeChanged(true);
    // }
    //
    // armorClassModifierDataHasChanged = () => {
    //     this.hasAcChanged(true);
    // }
    //
    // levelDataHasChanged = () => {
    //     this.hasLevelChanged(true);
    // }
    //
    // experienceDataHasChanged = () => {
    //     this.hasExperienceChanged(true);
    // }
    //
    // proficiencyHasChanged = () => {
    //     this.hasProficiencyChanged(true);
    // }
    //
    // resetSubscriptions = () => {
    //     this.setUpModelSubscriptions();
    //     this.hasInspirationChanged(false);
    //     this.hasAcChanged(false);
    //     this.hasLevelChanged(false);
    //     this.hasExperienceChanged(false);
    //     this.hasProficiencyChanged(false);
    //     this.hasInitiativeChanged(false);
    // }

    toggleInspiration = async () => {
        this.data.otherStats().inspiration(!this.data.otherStats().inspiration());
    }

    submit = async () => {
        await this.save();
        if (this.flip) {
            this.flip();
        }
    }
}

ko.components.register('other-stats-form', {
    viewModel: OtherStatsFormViewModel,
    template: template
});

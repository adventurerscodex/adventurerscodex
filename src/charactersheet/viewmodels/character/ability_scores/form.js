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
export class ScoreSaveFormViewModel  {
    constructor(params) {
        this.data = ko.utils.unwrapObservable(params.data);
        this.containerId = ko.utils.unwrapObservable(params.containerId);
        // Actions
        this.save = params.saveAction;
        this.reset = params.cancelAction;

        // Card Properties
        this.showForm = params.showForm;
        this.flip = params.flip;
        this.resize = params.resize;

        // List Properties
        this.add = params.add;
        this.remove = params.remove;
        this.addForm = ko.observable(false);


        this.currentEditItem = ko.observable();

        this.formElementHasFocus = ko.observable(false);

        this.showSaves = ko.observable(false);

      // this.bypassUpdate = ko.observable(false);
      // this.shouldShowDisclaimer = ko.observable(false);
    }

    order = [
        'Strength',
        'Dexterity',
        'Constitution',
        'Intelligence',
        'Wisdom',
        'Charisma'
    ];

    toggleSaves = (newValue) => {
        this.showSaves(!this.showSaves());
    };

    notify = () => {
        throw('you must provide a notification system');
    }


    submit = async () => {
        await this.save();
        if (this.flip) {
            this.flip();
        }
    }
}

ko.components.register('score-save-form', {
    viewModel: ScoreSaveFormViewModel,
    template: template
});

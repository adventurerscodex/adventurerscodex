
import {
  DataRepository,
  Fixtures
} from 'charactersheet/utilities';

import { Feat, Feature, Tracked, Trait } from 'charactersheet/models';
import { Notifications } from 'charactersheet/utilities';
import { TrackedFormController } from 'charactersheet/components/form-controller-tracked-component';


import { find } from 'lodash';
import ko from 'knockout';
import template from './form.html';

export class TrackedDetailForm extends TrackedFormController {

    trackedTypes = [  Feature, Trait, Feat ];

    generateBlank () {
        const typeName = this.existingData.constructor.name;
        if (typeName === Feature.name) {
            return new Feature();
        }
        if (typeName === Trait.name) {
            return new Trait();
        }
        if (typeName === Feat.name) {
            return new Feat();
        }
        return null;
    }

    notify = () => {
        const type = this.existingData.constructor.name.toLowerCase();
        Notifications.tracked[type].changed.dispatch();
    }

    validation = {
        // submitHandler: (form, event) => {
        //     event.preventDefault();
        //     self.modalFinishedClosing();
        // },
        // updateHandler: ($element) => {
        //     self.addFormIsValid($element.valid());
        // },
        // Deep copy of properties in object
        ...Tracked.validationConstraints
    };
}

ko.components.register('tracked-form', {
    viewModel: TrackedDetailForm,
    template: template
});

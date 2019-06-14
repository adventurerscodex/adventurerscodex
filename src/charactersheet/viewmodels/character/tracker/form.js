import { Feat, Feature, Tracked, Trait } from 'charactersheet/models';
import { AbstractChildTrackedFormModel } from 'charactersheet/viewmodels/abstract';
import { Notifications } from 'charactersheet/utilities';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class TrackedDetailForm extends AbstractChildTrackedFormModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    trackedTypes = [  Feature, Trait, Feat ];

    generateBlank () {
        const typeName = this.modelName;
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
        const type = this.modelName.toLowerCase();
        Notifications.tracked[type].changed.dispatch();
    }

    validation = {
        ...Tracked.validationConstraints.rules
    };
}

ko.components.register('tracked-form', {
    viewModel: TrackedDetailForm,
    template: template
});

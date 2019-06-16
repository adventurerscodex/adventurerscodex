import { AbstractChildTrackedFormModel } from 'charactersheet/viewmodels/abstract';
import { Clazz } from 'charactersheet/models';
import { Notifications } from 'charactersheet/utilities';
import { Tracked } from 'charactersheet/models';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class TrackedDetailForm extends AbstractChildTrackedFormModel {
    constructor(params) {
        super(params);
        this.modelName = params.modelName;
        autoBind(this);
    }

    modelClass () {
        if (!this.modelName) {
            // TODO: something is causing modelClass to be called more
            // Than desired, including *before* the constructor
            // can set a modelName. This is crappy. BUT, its still getting
            // called correctly .... soo we're leaving to discuss with Brian
            // throw(`Model Name or modelClass must be implemented by ${this.constructor.name}`);
            return undefined;
        }
        return Clazz[this.modelName];
    }

    notify = () => {
        const type = this.modelName.toLowerCase();
        Notifications.tracked[type].changed.dispatch();
    }

    validation = {
        ...Tracked.validationConstraints.rules
    }
}

ko.components.register('tracked-form', {
    viewModel: TrackedDetailForm,
    template: template
});

import { CoreManager, Notifications } from 'charactersheet/utilities';
import { AbstractChildFormModel } from 'charactersheet/viewmodels/abstract';
import { Tracked } from 'charactersheet/models';
import { TrackedForm } from 'charactersheet/components/form-tracked-component';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class TrackedDetailForm extends AbstractChildFormModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass() {
        if (this.existingData) {
            return this.existingData.ps.model.name;
        }
        return;
    }

    generateBlank() {
      // HACKALERT. generateBlank needs to figure the model type out from the
      // data for the tracker form. Since the tracker form does not support
      // the adding of new, arbitrary tracked items, I am accessing the model
      // from the data directly.
        if (this.existingData) {
            // Get a new model so we don't two-way bind data bleed.
            const newEntity = new this.existingData.ps.model();
            const coreKey = CoreManager.activeCore().uuid();
            newEntity.coreUuid(coreKey);
            return newEntity;
        }
        return null;
    }


    validation = {
        ...Tracked.validationConstraints.fieldParams
    }
}

ko.components.register('tracked-form', {
    viewModel: TrackedDetailForm,
    template: template
});

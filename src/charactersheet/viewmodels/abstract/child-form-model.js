import {
    CoreManager,
    DataRepository,
    Notifications
} from 'charactersheet/utilities';
import { filter, find } from 'lodash';
import {
    AbstractFormModel
} from './form-model';
import {
    FormSubmitActionComponent
} from 'charactersheet/components/form-submit-actions';
import { SELECTDATA } from 'charactersheet/constants';
import ko from 'knockout';

/**
 * AbstractChildFormModel
 *
 * Expands upon the AbstractFormModel to manage entities that are part of a
 * larger set. These get their data from a parent list, and need to
 * manage adding/removing themselves in their parent,
 *
 * @param containerId {string} the container of the form. Used to collapse
 * the container when deleted
 *
 * @param data {observable} The data under edit. Existing Data is imported
 * into the local entity for modification, before being returned to the parent.
 *
 * @property addForm (observable) Boolean flag to determine whether this is an addForm
 * for creating data;
 *
 **/

export class AbstractChildFormModel extends AbstractFormModel {

    constructor(params) {
        super(params);
        this.containerId = ko.utils.unwrapObservable(params.containerId);
        this.existingData = params.data;
        this.addForm = ko.observable(!this.existingData);
    }

    async refresh() {
        if (this.existingData) {
            this.entity().importValues(this.existingData.exportValues());
        } else {
            this.entity(this.generateBlank());
            this.entity().coreUuid(CoreManager.activeCore().uuid());
            this.addForm(true);
        }
        this.showDisclaimer(false);
    }

    async save() {
        let success = true, error = null;
        try {
            if (this.addForm()) {
                await this.entity().create();
            } else {
                await this.entity().save();
            }
        } catch(e) {
            success = false, error = e;
        }
        this.didSave(success, error);
    }

    didSave(success, error) {
        if (success) {
            Notifications.userNotification.successNotification.dispatch(
                'Your changes have been saved.',
                'Saved'
            );
        } else {
            const message = !!error ? error.message : '';
            Notifications.userNotification.dangerNotification.dispatch(
                `Encountered error while attempting to save. ${message}`,
                'Error'
            );
        }
    }

    async delete() {
        if (this.containerId) {
            $(`#${this.containerId}`).collapse('hide');
        }
        await this.entity().delete();
    }

    prePopFilter = (request, response) => {
        if (!this.prePopSource) {
            throw(`${this.constructor.name} must have a prePopSource`);
        }
        const term = request.term.toLowerCase();
        let results = [];
        if (term && term.length >= (this.prePopLimit || 0)) {
            const keys = DataRepository[this.prePopSource] ?
                Object.keys(DataRepository[this.prePopSource]) : [];
            results = keys.filter((name) => (name.toLowerCase().includes(term)));
        }
        response(results);
    };

    populate = (label, value) => {
        const item = DataRepository[this.prePopSource][label];
        this.entity().importValues(item);
        this.showDisclaimer(true);
        this.forceCardResize();
    };
}

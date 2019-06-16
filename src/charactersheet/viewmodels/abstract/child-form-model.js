import {
    CoreManager,
    DataRepository,
    Notifications
} from 'charactersheet/utilities';
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
 * @param addToParent {function} callback to add new entries to the parent.
 *
 * @param replaceInParent {function} callback to replace entries in the parent.
 *
 * @param removeFromParent {function} callback to remove entries from the parent.
 *
 **/

// No Op to support children forms that don't have parents (so, orphan forms)
const noOp = (entity) => {/* no op */};

export class AbstractChildFormModel extends AbstractFormModel {
    constructor(params) {
        super(params);
        this.containerId = ko.utils.unwrapObservable(params.containerId);
        this.existingData = params.data;
        this.addForm = ko.observable(false);

        this.addToParent = params.addToParent ? params.addToParent : noOp;
        this.replaceInParent = params.replaceInParent ? params.replaceInParent : noOp;
        this.removeFromParent = params.removeFromParent ? params.removeFromParent : noOp;
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
        if (this.addForm()) {
            const response = await this.entity().ps.create();
            this.addToParent(response.object);
        } else {
            const response = await this.entity().ps.save();
            await this.replaceInParent(response.object);
        }
    }

    async delete() {
        if (this.containerId) {
            $(`#${this.containerId}`).collapse('hide');
        }
        await this.entity().ps.delete();
        await this.removeFromParent(this.existingData);
        this.notify();
    }

    prePopFilter = (request, response) => {
        if (!this.prePopSource) {
            throw(`${this.constructor.name} must have a prePopSource`);
        }
        const term = request.term.toLowerCase();
        let results = [];

        if (term && term.length >= (this.prePopLimit || 0)) {
            const keys = DataRepository[this.prePopSource] ?
                Object.keys(DataRepository[this.prePopSource]) :
                [];
            results = keys.filter((name) => {
                return name.toLowerCase().indexOf(term) > -1;
            });
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

import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';

import { FormBaseController } from './form-base-controller';
import ko from 'knockout';

export class FormController extends FormBaseController {
    constructor(params) {
        super(params);
        // the container for this form. Used for collapse rows
        this.containerId = params.containerId;
        // Data to be managed by this form
        this.existingData = params.data;
        if (this.existingData) {
            this.entity().importValues(this.existingData.exportValues());
        } else {
            this.entity().coreUuid(CoreManager.activeCore().uuid());
            this.addForm(true);
        }
        const noOp = (entity) => {/* no op */};
        // Add/Remove callbacks. Used for lists.
        this.addToParent = params.addToParent ? params.addToParent : noOp;
        this.replaceInParent = params.replaceInParent ? params.replaceInParent : noOp;
        this.removeFromParent = params.removeFromParent ? params.removeFromParent : noOp;

    }

    refresh() {
        this.shouldShowDisclaimer(false);
        if (this.existingData) {
            this.entity().importValues(this.existingData.exportValues());
        } else {
            this.entity(this.generateBlank());
            this.entity().coreUuid(CoreManager.activeCore().uuid());
        }
    }

    async save() {
        if (this.addForm()) {
            const response = await this.entity().ps.create();
            this.addToParent(response.object);
        } else {
            const response = await this.entity().ps.save();
            this.replaceInParent(response.object);
        }
    }

    async delete() {
        if (this.containerId) {
            $(`#${this.containerId}`).collapse('hide');
        }
        await this.entity().ps.delete();
        this.removeFromParent(this.existingData);
        this.notify();
    }
}

import {
    AbstractGridViewModel
} from './grid-view-model';
import { DELAY } from 'charactersheet/constants';
import { filter } from 'lodash';
import ko from 'knockout';

import { Notifications } from 'charactersheet/utilities/notifications';

/**
 * AbstractGridFormModel, extends AbstractGridViewModel
 *
 * Provides a grid form for data, with form-like behaviors.
 *
 **/

export class AbstractGridFormModel extends AbstractGridViewModel {

    constructor(params) {
        super(params);
        this.formElementHasFocus = ko.observable(false);
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();
        const resizeForAdd = this.displayAddForm.subscribe(this.delayThenResize);
        this.subscriptions.push(resizeForAdd);
        const setFocus = this.show.subscribe(this.focusOnFlip);
        this.subscriptions.push(setFocus);
    }

    async focusOnFlip () {
        const setFocus = () => {
            this.formElementHasFocus(this.show());
        };
        await setTimeout(setFocus, DELAY.LONG);
    }

    async submit() {
        await this.save();
        this.flip(); // Refresh on flip
        this.notify();
    }

    async updateEntity(entity) {
        entity.markedForSave = true;
    }

    async save() {
        let success = true, error = null;
        try {
            const updates = filter(this.entities(), 'markedForSave').map(
              async (entity) => {
                  delete entity.markedForSave;
                  await entity.save();
              }
            );
            await Promise.all(updates);
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

    notify() {}

    reset() {
        // By the power of subscriptions, flip calls refresh;
        this.flip();
    }

    async delete(entity) {
        await entity.delete();
        this.notify();
        this.flip();
    }

    reviewInput = (data, event) => {
        if (event.target.checkValidity()) {
            event.target.classList.remove('error');
        } else {
            event.target.classList.add('error');
        }
    }

    invalidate = (data, event) => {
        event.target.classList.add('error');
        return true; // Continue validating
    }
}

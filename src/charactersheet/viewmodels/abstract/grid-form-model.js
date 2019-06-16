import {
  AbstractGridViewModel
} from './grid-view-model';
import { DELAY } from 'charactersheet/constants';
import ko from 'knockout';

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

    async updateEntity (entity) {
        entity.markedForSave = true;
    }

    async save () {
        const updates = this.entities().map(async (entity) => {
            if (entity.markedForSave) {
                delete entity.markedForSave;
                await entity.ps.save();
            }
        });
        await Promise.all(updates);
    }

    notify() {}

    reset() {
        // By the power of subscriptions, flip calls refresh;
        this.flip();
    }

    async delete(entity) {
        await entity.ps.delete();
        this.removeFromList(entity);
        this.notify();
        this.flip();
    }

    dispose() {
        this.disposeOfSubscriptions();
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

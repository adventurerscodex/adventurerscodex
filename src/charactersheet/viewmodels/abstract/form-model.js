import { Clazz } from 'charactersheet/models';
import { CoreManager } from 'charactersheet/utilities';
import { DELAY } from 'charactersheet/constants';
import { get } from 'lodash';
import ko from 'knockout';

const noOp = (entity) => { /* no op */ };
// noOp will be called for orphan forms that are not part of a card

/**
 * AbstractFormModel
 *
 * Provides the basis for forms to modify data.
 *
 * @param show {observable} whether or not this view is visible.
 *
 * @param flip {function} function for displaying/hiding the view. Used to
 * 'flip' flip-cards, or expand/collapse rows
 *
 * @param forceCardResize {function} function to resize containing card,
 *  as it is absolutely positioned
 *
 * @property formElementHasFocus (observable) Boolean flag to tell a field
 * it should focus
 *
 * @property showDisclaimer (observable) Boolean flag to tell the disclaimer to show
 * for creating data;
 **/

export class AbstractFormModel {
    constructor(params) {
        this.flip = params.flip ? params.flip : noOp;
        this.show = params.show ? params.show : ko.observable(true);
        this.forceCardResize = params.forceCardResize ? params.forceCardResize : noOp;
        if (params.modelName) {
            this.modelName = params.modelName;
        }
        this.entity = ko.observable();
        this.formElementHasFocus = ko.observable(false);
        this.showDisclaimer = ko.observable(false);
        this.loaded = ko.observable(false);
        this.subscriptions = [];
    }

    modelClass () {
        if (!this.modelName) {
            throw(`Model Name or modelClass must be implemented by ${this.constructor.name}`);
        }
        return Clazz[this.modelName];
    }

    generateBlank() {
        const thisClazz = this.modelClass();
        const newEntity = new thisClazz();
        const coreKey = CoreManager.activeCore().uuid();
        newEntity.coreUuid(coreKey);
        return newEntity;
    }

    async load() {
        this.entity(this.generateBlank());
        await this.refresh();
        this.setUpSubscriptions();
        this.loaded(true);
    }

    async refresh() {
        this.entity().load({ uuid: CoreManager.activeCore().uuid() });
        this.showDisclaimer(false);
    }

    async submit() {
        await this.save();
        // Flipping will automatically via subscription refresh dependent views
        this.flip();
        this.notify();
    }

    async save() {
        this.entity().save();
    }

    notify() {
      /* Implement via child classes */
    }

    reset() {
        // By the power of subscriptions, flip calls refresh;
        this.flip();
    }

    validation = {
        // Deep copy of properties in object
        ...get(this.modelClass(), 'validationConstraints.rules', {})
    };

    setUpSubscriptions() {
        const onShow = this.show.subscribe(this.subscribeToVisible);
        this.subscriptions.push(onShow);
        const setFocus = this.show.subscribe(this.focusOnFlip);
        this.subscriptions.push(setFocus);
        const showDisclaimerResize = this.showDisclaimer.subscribe(this.forceResize);
        this.subscriptions.push(showDisclaimerResize);
    }

    forceResize = () => {
        // Handle for browser order of operations so we don't calculate size
        // before the view is ready
        setTimeout(this.forceCardResize, DELAY.MEDIUM);
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

    async subscribeToVisible () {
        if (this.show()) {
            await this.refresh();
        }
    }

    async focusOnFlip () {
        const setFocus = () => {
            this.formElementHasFocus(this.show());
        };
        await setTimeout(setFocus, DELAY.LONG);
    }

    disposeOfSubscriptions() {
        this.subscriptions.forEach((subscription) => subscription.dispose());
        this.subscriptions = [];
    }

    dispose() {
        this.disposeOfSubscriptions();
    }
}

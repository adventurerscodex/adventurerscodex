import {
    CoreManager,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { CardEditActionComponent } from 'charactersheet/components/card-edit-actions';
import { Clazz } from 'charactersheet/models';

import ko from 'knockout';

/**
 * AbstractViewModel
 *
 * Provides base functionality to view Data instances.
 *
 * @property modelName {string} the name of the model being displayed.
 *
 * @param containerId {string} The dom id for the container of this component.
 *
 * @param flip {function} function for displaying/hiding the view. Used to
 * 'flip' flip-cards, or expand/collapse rows
 *
 * @param show {observable} Whether or not this view is displayed.
 *
 * @param existingData {optional observable} Existing data (such as data from a parent).
 *
 **/

export class AbstractViewModel {
    constructor(params) {
        this.coreKey = null;
        this.containerId = ko.utils.unwrapObservable(params.containerId);
        this.flip = params.flip;
        this.show = params.show ? params.show : ko.observable(true);
        this.existingData = params.data ? params.data : null;
        if (params.modelName) {
            this.modelName = params.modelName;
        }
        this.entity = ko.observable();
        this.loaded = ko.observable(false);
        this.subscriptions = [];
    }

    modelClass() {
        if (!this.modelName) {
            throw(`Model Name or modelClass must be implemented by ${this.constructor.name}`);
        }
        return Clazz[this.modelName];
    }

    generateBlank () {
        if (!this.modelName) {
            throw(`Model Name or modelClass must be implemented by ${this.constructor.name}`);
        }
        const thisClazz = this.modelClass();
        const newEntity = new thisClazz(); //Clazz[this.modelName];
        newEntity.coreUuid(this.coreKey);
        return newEntity;
    }

    async load() {
        this.coreKey = CoreManager.activeCore().uuid();
        this.entity(this.generateBlank());
        await this.refresh();
        this.setUpSubscriptions();
        this.loaded(true);
    }

    async refresh() {
        if (this.existingData) {
            this.entity().importValues(this.existingData.exportValues());
        } else {
            await this.entity().load({uuid: this.coreKey});
        }
    }

    setUpSubscriptions() {
        const showSubscription = this.show.subscribe(this.subscribeToVisible);
        this.subscriptions.push(showSubscription);
    }

    subscribeToVisible = async () => {
        if (this.show()) {
            await this.refresh();
        }
    }

    disposeOfSubscriptions() {
        this.subscriptions.forEach((subscription) => subscription.dispose());
        this.subscriptions = [];
    }

    dispose() {
        this.disposeOfSubscriptions();
    }

    shortText = (string) => {
        return Utility.string.truncateStringAtLength(
          ko.utils.unwrapObservable(string),
          25
        );
    };
}

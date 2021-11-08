import {
    CoreManager,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { ViewModel } from './view-model';
import { CardEditActionComponent } from 'charactersheet/components/card-edit-actions';
import { DELAY } from 'charactersheet/constants';
import { defer } from 'lodash';

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

export class AbstractViewModel extends ViewModel {
    constructor(params) {
        super(params);
        this.containerId = ko.utils.unwrapObservable(params.containerId);
        this.flip = params.flip;
        this.show = params.show ? params.show : ko.observable(true);
        this.existingData = params.data ? params.data : null;
        this.entity = ko.observable();
        this.loaded = ko.observable(false);
        this.subscriptions = [];
    }

    modelClass() {
        throw(`modelClass must be implemented by ${this.constructor.name}`);
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
        await super.load();
    }

    async refresh() {
        if (this.existingData) {
            this.entity().importValues(this.existingData.exportValues());
        } else {
            const coreKey = CoreManager.activeCore().uuid();
            await this.entity().load({uuid: coreKey});
        }
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();
        const showSubscription = this.show.subscribe(this.subscribeToVisible);
        this.subscriptions.push(showSubscription);
    }

    subscribeToVisible = async () => {
        if (this.show()) {
            await this.refresh();
        }
    }

    shortText = (string) => {
        return Utility.string.truncateStringAtLength(
            ko.utils.unwrapObservable(string),
            25
        );
    };
}

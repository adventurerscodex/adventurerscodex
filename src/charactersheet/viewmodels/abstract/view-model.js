import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';

import ko from 'knockout';

export class AbstractViewModel {
    constructor(params) {
        this.containerId = ko.utils.unwrapObservable(params.containerId);
        this.show = params.show;
        this.flip = params.flip;
        this.entity = ko.observable(this.generateBlank());
        this.loaded = ko.observable(false);
        this.subscriptions = [];
        if (params.data) {
            this.existingData = params.data;
        }
    }

    async load() {
        await this.refresh();
        this.setUpSubscriptions();
        this.loaded(true);
    }

    async refresh() {
        if (this.existingData) {
            this.entity().importValues(this.existingData.exportValues());
        } else {
            this.entity(this.generateBlank());
            this.entity().coreUuid(CoreManager.activeCore().uuid());
        }
    }

    disposeOfSubscriptions() {
        this.subscriptions.forEach((subscription) => subscription.dispose());
        this.subscriptions = [];
    }

    dispose() {
        this.disposeOfSubscriptions();
    }

    setUpSubscriptions() {
        const showSubscription = this.show.subscribe(this.subscribeToShowForm);
        this.subscriptions.push(showSubscription);
    }

    subscribeToShowForm = async () => {
        if (this.show()) {
            await this.refresh();
        }
    }
}

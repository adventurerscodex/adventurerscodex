import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';

import ko from 'knockout';

export class ACViewModel {
    constructor(params) {
        this.containerId = ko.utils.unwrapObservable(params.containerId);
        this.showBack = params.showBack;
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
        throw('refresh must be defined by subclasses of ACViewModel');
    }

    disposeOfSubscriptions () {
        this.subscriptions.forEach((subscription) => subscription.dispose());
        this.subscriptions = [];
    }

    dispose() {
        this.disposeOfSubscriptions();
    }

    setUpSubscriptions() {
        const showSubscription = this.showBack.subscribe(this.subscribeToShowForm);
        this.subscriptions.push(showSubscription);
    }

    subscribeToShowForm = () => {
        if (!this.showBack()) {
            this.refresh();
        }
    }
}

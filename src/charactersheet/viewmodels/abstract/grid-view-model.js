import {
    AbstractTabularViewModel
} from './tabular-view-model';
import ko from 'knockout';

export class AbstractGridViewModel extends AbstractTabularViewModel {
    constructor(params) {
        super(params);
        this.containerId = ko.utils.unwrapObservable(params.containerId);
        this.show = params.show;
        this.flip = params.flip;
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

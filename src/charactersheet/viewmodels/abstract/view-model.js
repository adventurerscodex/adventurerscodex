import {
    CoreManager,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { CardEditActionComponent } from 'charactersheet/components/card-edit-actions';
import { DELAY } from 'charactersheet/constants';
import { defer } from 'lodash';

import ko from 'knockout';


export class ViewModel {

    constructor(params) {
        this.loaded = ko.observable(false);
        this.subscriptions = [];
    }

    async load() {
        this.setUpSubscriptions();
        this.loaded(true);
    }

    setUpSubscriptions() {

    }

    disposeOfSubscriptions() {
        const disposeOfDisposable = (disposable) => {
            if (disposable.dispose) {
                disposable.dispose();
            } else if (disposable.detach) {
                disposable.detach();
            }

        };
        this.subscriptions.map((disposable) => defer(disposeOfDisposable, disposable));
        this.subscriptions = [];
    }

    dispose() {
        setTimeout(this.disposeOfSubscriptions.bind(this), DELAY.DISPOSE);
    }
}

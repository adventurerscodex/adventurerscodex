import { components, observable } from 'knockout';

import template from './index.html';

class NamedFieldsWell {

    wellOpen = observable();

    constructor({ observable, shouldDiscloseFields, title }) {
        this.observable = observable;
        this.shouldDiscloseFields = shouldDiscloseFields;
        this.title = title;

        // Subscribe to future updates
        this.observable.subscribe(this.observableDidChange);

        // Prime the pump
        this.observableDidChange();
    }

    onclick() {
        this.wellOpen(!this.wellOpen());
    }

    observableDidChange() {
        if (this.shouldDiscloseFields) {
            this.wellOpen(this.shouldDiscloseFields());
        }
    }

}

components.register('named-fields-well', {
    viewModel: NamedFieldsWell,
    template: template
});

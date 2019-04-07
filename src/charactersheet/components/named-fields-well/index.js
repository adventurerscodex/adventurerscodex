import { components, observable } from 'knockout';

import template from './index.html';

/**
 * A simple well that provides a customizable button to open it. Typically this
 * can be used to provide hidden additional fields for a form.
 *
 * This component accepts 3 parameters:
 *
 * @param title { string } The title to use for the advanced fields well.
 * @param observable { observable } The observable to use as the context and to
 * subscribe to for updates.
 * @param shouldDiscloseFields { function, optional } An optional call that should
 * return a boolean whether or not to show the fields. This is called whenever the
 * observable changes. Once toggled by the user, their choice overrides this value.
 *
 * Sample
 * ------
 *
 * Let's say we're making a form for a user and they have advanced fields.
 *
 *     <named-fields-well params="
 *      title: 'Financial Information',
 *      observable: user,
 *      shouldDiscloseFields: userHasEnteredFinancialInfo
 *     ">
 *        <!--
 *          Add your additional fields markup here.
 *          It's context is the `observable` you passed in.
 *        -->
 *        <input data-bind="value: ssn" />
 *     </named-fields-well>
 */
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

import {
    DataRepository,
    Fixtures,
    Notifications
} from 'charactersheet/utilities';
import { CardActionButton } from 'charactersheet/components/card-action-buttons';

import {
    FormController
} from 'charactersheet/components/form-controller-component';
import {
    Item
} from 'charactersheet/models';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class ItemFormViewModel extends FormController {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    generateBlank() {
        return new Item();
    }

    currencyDenominationOptions = Fixtures.general.currencyDenominationList;

    setItemCurrencyDenomination = (label, value) => {
        this.entity().currencyDenomination(value);
    };

    itemsPrePopFilter = (request, response) => {
        const term = request.term.toLowerCase();
        let results = [];
        if (term && term.length > 2) {
            const keys = DataRepository.items ?
                Object.keys(DataRepository.items) :
                [];
            results = keys.filter((name) => {
                return name.toLowerCase().indexOf(term) > -1;
            });
        }
        response(results);
    };

    populateItem = (label, value) => {
        const item = DataRepository.items[label];
        this.entity().importValues(item);
        this.shouldShowDisclaimer(true);
        this.forceCardResize();
    };

    notify = () => {
        Notifications.item.changed.dispatch();
    }

    validation = {
        ...Item.validationConstraints
    };
}

ko.components.register('item-form', {
    viewModel: ItemFormViewModel,
    template: template
});

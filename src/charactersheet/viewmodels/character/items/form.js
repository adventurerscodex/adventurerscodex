import {
  CoreManager,
  DataRepository,
  Fixtures,
  Notifications
} from 'charactersheet/utilities';

import { FormController } from 'charactersheet/components/form-controller-component';

import { Item } from 'charactersheet/models';

import { debounce } from 'lodash';
import ko from 'knockout';
import template from './form.html';


export class ItemFormViewModel  extends FormController {
    generateBlank() {
        return new Item();
    }

    currencyDenominationOptions = Fixtures.general.currencyDenominationList;

    setItemCurrencyDenomination = function(label, value) {
        this.entity().currencyDenomination(value);
    };

    itemsPrePopFilter = (request, response) => {
        const term = request.term.toLowerCase();
        let results = [];
        if (term && term.length > 2) {
            const keys = DataRepository.items
                  ? Object.keys(DataRepository.items)
                  : [];
            results = keys.filter((name) => {
                return name.toLowerCase().indexOf(term) > -1;
            });
        }
        response(results);
    };

    //Manipulating items
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

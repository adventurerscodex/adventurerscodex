import {
    Fixtures,
    Notifications
} from 'charactersheet/utilities';
import { AbstractChildFormModel } from 'charactersheet/viewmodels/abstract';
import { Item } from 'charactersheet/models';
import { SELECTDATA } from 'charactersheet/constants';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class ItemFormViewModel extends AbstractChildFormModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass () {
        return Item;
    }

    prePopSource = 'items';
    prePopLimit = SELECTDATA.MEDIUM;

    currencyDenominationOptions = Fixtures.general.currencyDenominationList;
    setItemCurrencyDenomination = (label, value) => {
        this.entity().currencyDenomination(value);
    };
}

ko.components.register('item-form', {
    viewModel: ItemFormViewModel,
    template: template
});

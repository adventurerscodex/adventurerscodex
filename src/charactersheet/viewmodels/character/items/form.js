import {
    CoreManager,
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

    async refresh() {
        await super.refresh();
        const { objects: parents } = await Item.ps.list({
            coreUuid: CoreManager.activeCore().uuid(),
            isContainer: true,
        });
        this.parentItemOptions(parents);
    }

    prePopSource = 'items';
    prePopLimit = SELECTDATA.MEDIUM;

    parentItemOptions = ko.observable();

    currencyDenominationOptions = Fixtures.general.currencyDenominationList;

    setItemCurrencyDenomination = (label, value) => {
        this.entity().currencyDenomination(value);
    };

    resizeOnFieldVisibility = () => {
        setTimeout(this.forceCardResize, 50);
    }
}

ko.components.register('item-form', {
    viewModel: ItemFormViewModel,
    template: template
});

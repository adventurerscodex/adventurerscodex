import autoBind from 'auto-bind';
import { Fixtures } from 'charactersheet/utilities';
import { AbstractTreasureFormViewModel } from 'charactersheet/viewmodels/abstract';
import { EncounterItem, Treasure } from 'charactersheet/models/dm';
import ko from 'knockout';
import template from './item.form.html';
import { SELECTDATA } from 'charactersheet/constants';


class EncounterItemFormViewModel extends AbstractTreasureFormViewModel {

    constructor(params) {
        super(params);
        autoBind(this);
    }

    prePopSource = 'items';
    prePopLimit = SELECTDATA.LONG;

    modelClass() {
        return Treasure;
    }

    treasureClass() {
        return EncounterItem;
    }

    treasureType() {
        return Treasure.TYPE.ITEM;
    }

    // Field-Level Pre-population

    currencyDenominationOptions = Fixtures.general.currencyDenominationList;
    setCurrencyDenomination = (label, value) => {
        this.entity().value().currencyDenomination(value);
    }
}


ko.components.register('treasure-item-form', {
    viewModel: EncounterItemFormViewModel,
    template: template
});

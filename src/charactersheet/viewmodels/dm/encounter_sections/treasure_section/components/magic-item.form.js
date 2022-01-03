import autoBind from 'auto-bind';
import { Fixtures } from 'charactersheet/utilities';
import { AbstractTreasureFormViewModel } from 'charactersheet/viewmodels/abstract';
import { EncounterMagicItem, Treasure } from 'charactersheet/models/dm';
import ko from 'knockout';
import template from './magic-item.form.html';
import { SELECTDATA } from 'charactersheet/constants';


class EncounterMagicItemFormViewModel extends AbstractTreasureFormViewModel {

    constructor(params) {
        super(params);
        autoBind(this);
    }

    prePopSource = 'magicItems';
    prePopLimit = SELECTDATA.LONG;

    modelClass() {
        return Treasure;
    }

    treasureClass() {
        return EncounterMagicItem;
    }

    treasureType() {
        return Treasure.TYPE.MAGIC_ITEM;
    }

    // Field-Level Pre-population

    typeOptions = Fixtures.magicItem.magicItemTypeOptions;
    setType = (label, value) => {
        this.entity().value().type(value);
    };

    rarityOptions = Fixtures.magicItem.magicItemRarityOptions;
    setRarity = (label, value) => {
        this.entity().value().rarity(value);
    };

    currencyDenominationOptions = Fixtures.general.currencyDenominationList;
    setCurrencyDenomination = (label, value) => {
        this.entity().value().currencyDenomination(value);
    };
}


ko.components.register('treasure-magic-item-form', {
    viewModel: EncounterMagicItemFormViewModel,
    template: template
});

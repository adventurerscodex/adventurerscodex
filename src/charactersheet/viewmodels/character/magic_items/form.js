import {
  Fixtures,
  Notifications
} from 'charactersheet/utilities';
import {
  AbstractChildFormModel
} from 'charactersheet/viewmodels/abstract';
import { MagicItem } from 'charactersheet/models';
import { SELECTDATA } from 'charactersheet/constants';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';


export class MagicItemFormViewModel  extends AbstractChildFormModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass () {
        return MagicItem;
    }

    prePopSource = 'magicItems';
    prePopLimit = SELECTDATA.MEDIUM;

    typeOptions = Fixtures.magicItem.magicItemTypeOptions;
    setMagicItemType = (label, value) => {
        this.entity().type(value);
    };

    rarityOptions = Fixtures.magicItem.magicItemRarityOptions;
    setMagicItemRarity = (label, value) => {
        this.entity().rarity(value);
    }


    setUpSubscriptions () {
        super.setUpSubscriptions();
        this.entity().maxCharges.subscribe(this.resizeOnFieldVisibility);
        this.entity().requiresAttunement.subscribe(this.resizeOnFieldVisibility);
    }

    resizeOnFieldVisibility = () => {
        setTimeout(this.forceCardResize, 50);
    }

    notify = () => {
        Notifications.magicItem.changed.dispatch();
    }
}

ko.components.register('magic-item-form', {
    viewModel: MagicItemFormViewModel,
    template: template
});

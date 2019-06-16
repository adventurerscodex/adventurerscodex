import { AbstractFormModel } from 'charactersheet/viewmodels/abstract';
import { Notifications } from 'charactersheet/utilities';
import { Wealth } from 'charactersheet/models';

import autoBind from 'auto-bind';
import cpCoins from 'images/cp-coin.svg';
import epCoins from 'images/ep-coin.svg';
import gpCoins from 'images/gp-coin.svg';
import ko from 'knockout';
import ppCoins from 'images/pp-coin.svg';
import spCoins from 'images/sp-coin.svg';
import template from './form.html';


export class WealthFormViewModel  extends AbstractFormModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass() {
        return Wealth;
    }

    cpCoins = cpCoins;
    epCoins = epCoins;
    gpCoins = gpCoins;
    ppCoins = ppCoins;
    spCoins = spCoins;

    notify = () => {
        Notifications.wealth.changed.dispatch();
    }
}

ko.components.register('wealth-form', {
    viewModel: WealthFormViewModel,
    template: template
});

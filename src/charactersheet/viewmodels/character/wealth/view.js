import { AbstractViewModel } from 'charactersheet/viewmodels/abstract';
import { Wealth } from 'charactersheet/models';

import autoBind from 'auto-bind';
import cpCoins from 'images/cp-coin.svg';
import epCoins from 'images/ep-coin.svg';
import gpCoins from 'images/gp-coin.svg';
import ko from 'knockout';
import ppCoins from 'images/pp-coin.svg';
import spCoins from 'images/sp-coin.svg';
import template from './view.html';

class WealthViewModel extends AbstractViewModel {
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

    toFormatted = (number) => {
        const intNum = parseInt(ko.utils.unwrapObservable(number));
        if (!isNaN(intNum)) {
            return number().toLocaleString('en', {useGrouping:true});
        }
        return number;
    }
}

ko.components.register('wealth-view', {
    viewModel: WealthViewModel,
    template: template
});

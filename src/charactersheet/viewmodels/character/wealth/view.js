import { ACViewModel } from 'charactersheet/components/view-component';
import { CoreManager } from 'charactersheet/utilities';
import { Wealth } from 'charactersheet/models/common';

import cpCoins from 'images/cp-coin.svg';
import epCoins from 'images/ep-coin.svg';
import gpCoins from 'images/gp-coin.svg';
import ko from 'knockout';
import ppCoins from 'images/pp-coin.svg';
import spCoins from 'images/sp-coin.svg';
import template from './view.html';

class WealthViewModel extends ACViewModel {

    generateBlank () {
        return new Wealth();
    }
    cpCoins = cpCoins;
    epCoins = epCoins;
    gpCoins = gpCoins;
    ppCoins = ppCoins;
    spCoins = spCoins;

    refresh = async () => {
        const key = CoreManager.activeCore().uuid();
        const wealth = await Wealth.ps.read({uuid: key});
        this.entity(wealth.object);
    }
}

ko.components.register('wealth-view', {
    viewModel: WealthViewModel,
    template: template
});

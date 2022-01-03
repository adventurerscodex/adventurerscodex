import autoBind from 'auto-bind';
import { Fixtures } from 'charactersheet/utilities';
import { AbstractTreasureFormViewModel } from 'charactersheet/viewmodels/abstract';
import { EncounterCoins, Treasure } from 'charactersheet/models/dm';
import ko from 'knockout';
import template from './coins.form.html';
import { SELECTDATA } from 'charactersheet/constants';

import cpCoin from 'images/cp-coin.svg';
import epCoin from 'images/ep-coin.svg';
import gpCoin from 'images/gp-coin.svg';
import spCoin from 'images/sp-coin.svg';
import ppCoin from 'images/pp-coin.svg';


class EncounterCoinsFormViewModel extends AbstractTreasureFormViewModel {

    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass() {
        return Treasure;
    }

    treasureClass() {
        return EncounterCoins;
    }

    treasureType() {
        return Treasure.TYPE.COINS;
    }

    icons = {
        cpCoin,
        spCoin,
        epCoin,
        gpCoin,
        ppCoin,
    };
}


ko.components.register('treasure-coins-form', {
    viewModel: EncounterCoinsFormViewModel,
    template: template
});

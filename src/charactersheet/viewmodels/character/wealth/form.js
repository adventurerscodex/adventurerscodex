import {
  CoreManager,
  Notifications
} from 'charactersheet/utilities';
import {
  AbstractFormModel
} from 'charactersheet/viewmodels/abstract';
import {
  CardSubmitActionComponent
} from 'charactersheet/components/card-submit-actions';
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

    generateBlank() {
        return new Wealth();
    }

    cpCoins = cpCoins;
    epCoins = epCoins;
    gpCoins = gpCoins;
    ppCoins = ppCoins;
    spCoins = spCoins;

    refresh = async () => {
        const key = CoreManager.activeCore().uuid();
        const response = await Wealth.ps.read({uuid: key});
        this.entity().importValues(response.object.exportValues());
    }

    notify = () => {
        Notifications.wealth.changed.dispatch();
    }

    validation = {
        // Deep copy of properties in object
        ...Wealth.validationConstraints.rules
    };
}

ko.components.register('wealth-form', {
    viewModel: WealthFormViewModel,
    template: template
});

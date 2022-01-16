import { ModelBackedViewModel } from 'charactersheet/viewmodels/abstract';
import { Wealth } from 'charactersheet/models';
import { PartyService } from 'charactersheet/services';

import autoBind from 'auto-bind';
import cpCoins from 'images/cp-coin.svg';
import epCoins from 'images/ep-coin.svg';
import gpCoins from 'images/gp-coin.svg';
import ko from 'knockout';
import ppCoins from 'images/pp-coin.svg';
import spCoins from 'images/sp-coin.svg';
import template from './view.html';

class WealthViewModel extends ModelBackedViewModel {
    constructor(params) {
        super(params);
        autoBind(this);

        this.quickSpendAmount = ko.observable();
        this.quickSpendCoinType = ko.observable('gold');
        this.quickSpendMessage = ko.observable('');
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

    async quickSpend() {
        this.quickSpendMessage('');  // Clear any previous message

        const quickSpendAmount = this.quickSpendAmount() | 0;
        const type = this.quickSpendCoinType();
        const totalAmountInCopper = quickSpendAmount * this.entity().EXCHANGE_RATES[type];

        if (!!quickSpendAmount
            && quickSpendAmount >= 0
            && this.entity().worthInCopper() >= totalAmountInCopper) {
            try {
                this.entity().subtract(quickSpendAmount, type);
                await this.entity().ps.save();
            } catch(e) {
                this.quickSpendMessage(`Error: ${e.message}`);
            }
        } else if (quickSpendAmount < 0) {
            this.quickSpendMessage('Please enter a positive value.');
        } else {
            this.quickSpendMessage('You don\'t have that much money.')
        }

        this.quickSpendAmount('');

        PartyService.updatePresence();
    }
}

ko.components.register('wealth-view', {
    viewModel: WealthViewModel,
    template: template
});

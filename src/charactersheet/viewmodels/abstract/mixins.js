import { isNumeric } from 'jquery';
import ko from 'knockout';

export function calculateLoad (
   entity,
   weightProperty = 'weight',
   quantityProperty = 'quantity'
 ) {
    const mass = ko.utils.unwrapObservable(entity);
    let weight = 0;
    if (weightProperty in mass) {
        weight = parseInt(ko.utils.unwrapObservable(mass[weightProperty]));
        if (isNaN(weight)) {
            weight = 0;
        }
    }
    let quantity = 1;
    if (quantityProperty in mass) {
        quantity = parseInt(ko.utils.unwrapObservable(mass[quantityProperty]));
        if (isNaN(quantity)) {
            quantity = 1;
        }
    }
    return weight * quantity;
}

export function calculateTotalLoad (
  entityList,
  weightProperty = 'weight',
  quantityProperty = 'quantity'
) {
    if (entityList.length === 0) {
        return '0(lbs)';
    }
    const total = entityList.map(
      entity => calculateLoad(
        entity,
        weightProperty,
        quantityProperty)).reduce((a, b) => a + b);
    return `~${Math.round(total)}(lbs)`;
}

const calculateCoinValue = (coin) => {
    if (isNumeric(coin)) {
        return parseFloat(coin);
    }
    switch (`${coin}`.toLowerCase().trim()) {
    case 'cp':
        return 0.01;
    case 'sp':
        return 0.1;
    case 'ep':
        return 0.5;
    case 'gp':
        return 1;
    case 'pp':
        return 10;
    default:
        return 1;
    }
};

export function calculateValue (
   entity,
   valueProperty = 'price',
   quantityProperty = 'quantity',
   coinProperty = 'currencyDenomination'
 ) {
    const commodity = ko.utils.unwrapObservable(entity);

    let coinValue = 1;
    if (coinProperty in commodity) {
        coinValue = calculateCoinValue(ko.utils.unwrapObservable(commodity[coinProperty]));
    }
    let quantity = 1;
    if (quantityProperty in commodity) {
        quantity = parseInt(ko.utils.unwrapObservable(commodity[quantityProperty]));
        if (isNaN(quantity)) {
            quantity = 1;
        }
    }
    let value = 0;
    if (valueProperty in commodity) {
        value = parseInt(ko.utils.unwrapObservable(commodity[valueProperty]));
        if (isNaN(value)) {
            value = 0;
        }
    }
    return coinValue * quantity * value;
}


export function calculateTotalValue (
  entityList,
  valueProperty = 'price',
  quantityProperty = 'quantity',
  coinProperty = 'currencyDenomination'
) {
    if (entityList.length === 0) {
        return '0 (gp)';
    }
    const total = entityList.map(
      entity => calculateValue(
        entity,
        valueProperty,
        quantityProperty,
        coinProperty)
      ).reduce((a, b) => a + b);
    return `~${Math.round(total)}(gp)`;
}

//
// export function calculateValue
//
// export function calculateTotalValue (entityList, costProperty, coinProperty) {
//     if (this.entities().length === 0) {
//         return '0 (gp)';
//     }
//     const calculateCost = (cost, coin) => {
//         if (coin.toLowerCase() === 'cp') {
//             return parseInt(cost)/100;
//         } else if (coin.toLowerCase() === 'sp') {
//             return parseInt(cost)/10;
//         } else if (coin.toLowerCase() === 'ep') {
//             return parseInt(cost)/2;
//         } else if (coin.toLowerCase() === 'pp') {
//             return parseInt(cost) * 10;
//         }
//         return cost;
//     };
//
//     const total = this.entities().map(
//         entity => calculateCost(entity.price(), entity.currencyDenomination())
//     ).reduce(
//         (a, b) => a + b
//     );
//     return `~${Math.round(total)}(gp)`;
// });

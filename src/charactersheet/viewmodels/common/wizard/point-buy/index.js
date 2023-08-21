import ko from 'knockout';
import template from './index.html';


export class PointBuyViewModel {

    POINT_BUY_MAX_POINTS = 27;
    POINT_BUY_MAP = {
        '8': 0,
        '9': 1,
        '10': 2,
        '11': 3,
        '12': 4,
        '13': 5,
        '14': 7,
        '15': 9,
    };

    constructor(params) {
        this.scores = params.scores;

        this.pointBuyMin = ko.observable(8);
        this.pointBuyMax = ko.observable(15);
    }

    pointsLeft = ko.pureComputed(() => (
        this.POINT_BUY_MAX_POINTS - this.scores().map(score => (
            this.POINT_BUY_MAP[score.value()] || 0
        )).reduce((a, b) => a + b, 0)
    ));

    reset() {
        this.scores().forEach(score => score.value(8));
    }
}


ko.components.register('point-buy', {
    viewModel: PointBuyViewModel,
    template: template
});

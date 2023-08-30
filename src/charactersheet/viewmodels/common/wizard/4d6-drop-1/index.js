import ko from 'knockout';
import template from './index.html';
import { RandomNumberGeneratorService } from 'charactersheet/services/common';

export class D6Drop1ViewModel {

    constructor(params) {
        this.scores = params.scores;
        this.rolls = ko.observableArray([]);
    }

    roll() {
        const service = RandomNumberGeneratorService.sharedService();
        this.rolls([]);
        this.scores().forEach(score => {
            const rolls = [
                service.rollDie(6),
                service.rollDie(6),
                service.rollDie(6),
                service.rollDie(6),
            ].sort().reverse();
            const total = rolls.slice(0, 3).reduce((a, b) => a + b, 0);
            score.value(total);
            this.rolls.push(rolls);
        });
    }

    reset() {
        this.scores().forEach(score => score.value(8));
        this.rolls([]);
    }
}


ko.components.register('d6-drop-1', {
    viewModel: D6Drop1ViewModel,
    template: template
});

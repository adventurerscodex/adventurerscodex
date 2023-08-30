import ko from 'knockout';
import template from './index.html';


export class ManualViewModel {

    constructor(params) {
        this.scores = params.scores;
    }
}


ko.components.register('manual', {
    viewModel: ManualViewModel,
    template: template
});

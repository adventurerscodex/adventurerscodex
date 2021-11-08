import { ModelBackedViewModel } from 'charactersheet/viewmodels/abstract';
import { Background } from 'charactersheet/models/character';
import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';

export class BackgroundViewModel extends ModelBackedViewModel {
    constructor(params) {
        super(params);
        this.modelClass.bind(this);
        autoBind(this);
    }

    modelClass() {
        return Background;
    }
}

ko.components.register('background-view', {
    viewModel: BackgroundViewModel,
    template: template
});

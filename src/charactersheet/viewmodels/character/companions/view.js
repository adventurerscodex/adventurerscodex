import { ModelBackedViewModel } from 'charactersheet/viewmodels/abstract';
import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';

export class CompanionViewModel extends ModelBackedViewModel {
    constructor(params) {
        super(params);
        this.modelClass.bind(this);
        autoBind(this);
    }

    modelClass() {
        return Companion;
    }
}

ko.components.register('companion-view', {
    viewModel: CompanionViewModel,
    template: template
});

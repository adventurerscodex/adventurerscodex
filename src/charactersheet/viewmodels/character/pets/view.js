import { ModelBackedViewModel } from 'charactersheet/viewmodels/abstract';
import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';

export class PetViewModel extends ModelBackedViewModel {
    constructor(params) {
        super(params);
        this.modelClass.bind(this);
        autoBind(this);
    }

    modelClass() {
        return Pet;
    }
}

ko.components.register('pet-view', {
    viewModel: PetViewModel,
    template: template
});

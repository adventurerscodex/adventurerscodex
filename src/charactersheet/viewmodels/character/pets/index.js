import './view';

import { AbstractTabularViewModel } from 'charactersheet/viewmodels/abstract';
import { Pet } from 'charactersheet/models';
import { PetFormViewModel } from './form';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';


export class PetsListViewModel extends AbstractTabularViewModel {

    constructor(params) {
        super(params);
        this.addFormId = '#add-pet';
        this.collapseAllId = '#pets-pane';
        autoBind(this);
    }

    modelClass () {
        return Pet;
    }

    getDefaultSort () {
        return this.sorts()['name asc'];
    }

    sorts() {
        return {
            'name asc': { field: 'name', direction: 'asc'},
            'name desc': { field: 'name', direction: 'desc'}
        };
    }
}

ko.components.register('pets-list', {
    viewModel: PetsListViewModel,
    template: template
});

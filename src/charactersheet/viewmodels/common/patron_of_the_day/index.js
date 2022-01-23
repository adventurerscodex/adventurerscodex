import autoBind from 'auto-bind';
import { observable, components } from 'knockout';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import { Patron } from 'charactersheet/models/common';
import template from './index.html';
import 'animate.css';

export class PatronOfTheDayViewModel extends ViewModel {

    constructor() {
        super();
        autoBind(this);

        this.entity = observable();
    }

    async load() {
        const { object: patron } = await Patron.ps.read();
        this.entity(patron);
    }
}

components.register('patron-of-the-day', {
    viewModel: PatronOfTheDayViewModel,
    template: template
});

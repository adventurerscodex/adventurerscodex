import { AbstractFormModel } from 'charactersheet/viewmodels/abstract';
import { Background } from 'charactersheet/models/character';
import { Fixtures } from 'charactersheet/utilities';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class BackgroundFormViewModel extends AbstractFormModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass () {
        return Background;
    }

    backgroundOptions = Fixtures.profile.backgroundOptions;
    setBackground = (label, value) => {
        this.entity().name(value);
    };
}

ko.components.register('background-form', {
    viewModel: BackgroundFormViewModel,
    template: template
});

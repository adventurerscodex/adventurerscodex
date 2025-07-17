import { AbstractChildFormModel } from 'charactersheet/viewmodels/abstract';
import { ShareKey } from 'charactersheet/models/common';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class ShareKeyFormViewModel extends AbstractChildFormModel {
    constructor(params) {
        super(params);
        autoBind(this);

        this.core = params.core;
    }

    modelClass () {
        return ShareKey;
    }
}

ko.components.register('sharekey-form', {
    viewModel: ShareKeyFormViewModel,
    template: template
});

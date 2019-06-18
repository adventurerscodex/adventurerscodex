import { AbstractChildTrackedFormModel } from 'charactersheet/viewmodels/abstract';
import { Feat } from 'charactersheet/models';
import { Fixtures } from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';
import { SELECTDATA } from 'charactersheet/constants';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class FeatFormViewModel extends AbstractChildTrackedFormModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass () {
        return Feat;
    }
    prePopSource = 'feats';
    prePopLimit = SELECTDATA.LONG;

    classOptions = Fixtures.profile.classOptions;

    popoverText = () => ('Tracked Feats are listed in the Tracker.');
}

ko.components.register('feat-form', {
    viewModel: FeatFormViewModel,
    template: template
});

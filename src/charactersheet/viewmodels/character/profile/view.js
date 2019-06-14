import { AbstractViewModel } from 'charactersheet/viewmodels/abstract';
import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';

export class ProfileViewModel extends AbstractViewModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelName = 'Profile';

    weightLabel = ko.pureComputed(() => {
        const weight = ko.utils.unwrapObservable(this.entity().weight);
        if (this.isNumeric(weight)) {
            return weight + ' (lbs)';
        } else {
            return 'No Weight';
        }
    });
}

ko.components.register('profile-view', {
    viewModel: ProfileViewModel,
    template: template
});

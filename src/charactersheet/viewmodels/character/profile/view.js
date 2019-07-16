import { AbstractViewModel } from 'charactersheet/viewmodels/abstract';
import { Profile } from 'charactersheet/models/character';
import autoBind from 'auto-bind';
import { isNumeric } from 'jquery';
import ko from 'knockout';
import template from './view.html';

export class ProfileViewModel extends AbstractViewModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass() {
        return Profile;
    }

    weightLabel = ko.pureComputed(() => {
        const weight = ko.utils.unwrapObservable(this.entity().weight);
        if (isNumeric(weight)) {
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

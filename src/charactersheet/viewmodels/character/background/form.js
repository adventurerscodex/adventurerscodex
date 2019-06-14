import {
    CoreManager,
    Fixtures,
    Notifications
} from 'charactersheet/utilities';
import {
    AbstractFormModel
} from 'charactersheet/viewmodels/abstract';
import {
    Background
} from 'charactersheet/models/character';
import {
    CardSubmitActionComponent
} from 'charactersheet/components/card-submit-actions';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class BackgroundFormViewModel extends AbstractFormModel {
    constructor(params) {
        super(params);
        // Notification Properties
        autoBind(this);
    }

    backgroundOptions = Fixtures.profile.backgroundOptions;

    generateBlank() {
        return new Background();
    }

    async load() {
        super.load();
        await this.refresh();
    }

    async refresh() {
        await super.refresh();
        const key = CoreManager.activeCore().uuid();
        const response = await Background.ps.read({
            uuid: key
        });
        this.entity().importValues(response.object.exportValues());
    }

    validation = {
        ...Background.validationConstraints.rules
    }

    notify = async () => {
        // background notification doesn't exist
        // Notifications.background.changed.dispatch();
    }

    setBackground = (label, value) => {
        this.entity().name(value);
    };
}

ko.components.register('background-form', {
    viewModel: BackgroundFormViewModel,
    template: template
});

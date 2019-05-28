import {
    CoreManager,
    Fixtures,
    Notifications
} from 'charactersheet/utilities';
import {
    Background
} from 'charactersheet/models/character';
import {
    CardActionButton
} from 'charactersheet/components/card-action-buttons';
import {
    FormBaseController
} from 'charactersheet/components/form-base-controller';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class BackgroundFormViewModel extends FormBaseController {
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
        Notifications.background.changed.dispatch();
    }

    setBackground = (label, value) => {
        this.entity().name(value);
    };
}

ko.components.register('background-form', {
    viewModel: BackgroundFormViewModel,
    template: template
});

import 'bin/popover_bind';

import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';

import { ACViewModel } from 'charactersheet/components/view-component';
import {
    Background
} from 'charactersheet/models/character';

import autoBind from 'auto-bind';
import { getModifier } from 'charactersheet/models/character/ability_score';


import ko from 'knockout';
import template from './view.html';

export class BackgroundViewModel extends ACViewModel {
    constructor(params) {
        super(params);
        // Calculated Field
        autoBind(this);
    }

    generateBlank () {
        return new Background();
    }

    async load() {
        await super.load();
        await this.refresh();
    }

    async refresh () {
        await super.refresh();
        const key = CoreManager.activeCore().uuid();
        const response = await Background.ps.read({uuid: key});
        this.entity().importValues(response.object.exportValues());
    }

    setUpSubscriptions = () => {
        super.setUpSubscriptions();
    }

    validation = {
        // Deep copy of properties in object
        ...Background.validationConstraints
    };
}

ko.components.register('background-view', {
    viewModel: BackgroundViewModel,
    template: template
});

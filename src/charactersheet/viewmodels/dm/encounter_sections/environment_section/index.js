import autoBind from 'auto-bind';
import ko from 'knockout';
import { ModelBackedViewModel } from 'charactersheet/viewmodels/abstract';
import { Environment } from 'charactersheet/models/dm/encounter_sections';
import {
    CoreManager,
    Fixtures,
    Utility
} from 'charactersheet/utilities';
import template from './index.html';
import './form';
import './view';


class EnvironmentSectionViewModel extends ModelBackedViewModel {

    constructor(params) {
        super(params);
        autoBind(this);
        this.encounter = params.encounter;
    }

    fullScreen = ko.observable(false);

    // Overrides

    modelClass() {
        return Environment;
    }

    generateBlank() {
        const newEntity = super.generateBlank();
        newEntity.uuid(this.encounter().uuid());
        return newEntity;
    }

    async refresh() {
        if (this.existingData) {
            this.entity().importValues(this.existingData.exportValues());
        } else {
            const coreKey = CoreManager.activeCore().uuid();
            const encounterId = this.encounter().uuid();
            await this.entity().load({coreUuid: coreKey, uuid: encounterId });
        }
    }

    // UI

    convertedImageLink = ko.pureComputed(() => (
        Utility.string.createDirectDropboxLink(this.entity().imageUrl())
    ));
}


ko.components.register('environment-section', {
    viewModel: EnvironmentSectionViewModel,
    template: template
});

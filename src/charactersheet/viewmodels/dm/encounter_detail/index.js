import { CoreManager } from 'charactersheet/utilities';
import { EncounterSection } from 'charactersheet/models/dm/encounter_section';
import { Notifications, Fixtures } from 'charactersheet/utilities';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import ko from 'knockout';
import template from './index.html';
import './index.css';


class EncounterDetailViewModel extends ViewModel {

    constructor(params) {
        super(params);
        this.encounter = params.encounter;
        this.column = params.column;

        this.activeSection = ko.observable();
    }

    sectionIsVisible(sectionIdentifier) {
        const sectionName = Fixtures.encounter.sections[sectionIdentifier].name;
        return this.encounter().sections().filter(({ name }) => (
            name() === sectionName
        ))[0].visible()
    }

    sectionIsActive(sectionName) {
        return this.activeSection() === sectionName;
    }

    push(component, params) {
        this.activeSection(component);
        this.column.push(component, params);
    }
}


ko.components.register('encounter-detail', {
    viewModel: EncounterDetailViewModel,
    template: template
});

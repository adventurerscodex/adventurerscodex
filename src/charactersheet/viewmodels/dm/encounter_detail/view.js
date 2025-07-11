import autoBind from 'auto-bind';
import { Notifications, Fixtures } from 'charactersheet/utilities';
import { Encounter } from 'charactersheet/models/dm';
import { AbstractEncounterFormViewModel } from 'charactersheet/viewmodels/abstract';
import ko from 'knockout';
import template from './view.html';


class EncounterDetailViewModel extends AbstractEncounterFormViewModel {

    constructor(params) {
        super(params);
        autoBind(this);
        this.column = params.column;
        this.activeSection = ko.observable();
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();

        this.subscriptions.push(Notifications.encounter.changed.add(this.encounterDidChange));
    }

    modelClass() {
        return Encounter;
    }

    // UI

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

    // Events

    encounterDidChange(encounter) {
        if (this.encounter().uuid() === encounter.uuid()) {
            this.encounter(encounter);
        }
    }
}


ko.components.register('encounter-detail-view', {
    viewModel: EncounterDetailViewModel,
    template: template
});

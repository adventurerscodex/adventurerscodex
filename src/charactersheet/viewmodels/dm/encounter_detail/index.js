import { CoreManager } from 'charactersheet/utilities';
import { Encounter } from 'charactersheet/models/dm';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { Notifications } from 'charactersheet/utilities';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';
import template from './index.html';


export function EncounterDetailViewModel(params) {
    var self = this;

    self.encounter = params.encounter;
    self.sectionModels = params.sectionModels;
    self.sections = ko.observableArray([]);
    self.openModal = ko.observable(false);

    /* Public Methods */

    self.load = function() {
        self.encounter.subscribe(self._dataHasChanged);
        self._dataHasChanged();
    };

    /**
     * The modal's done button has been clicked. Save the results and
     * notify the subscribers.
     */
    self.notifySections = function(encounter, sections) {
        encounter().save();

        sections().forEach(function(section, i, _) {
            section.save();
        });

        Notifications.encounters.changed.dispatch();
    };

    /* UI Methods */

    self.name = ko.pureComputed(function() {
        return self.encounter().displayName();
    });

    self.encounterLocation = ko.pureComputed(function() {
        return self.encounter().encounterLocation();
    });

    self.toggleModal = function() {
        self.openModal(!self.openModal());
    };

    self._dataHasChanged = function() {
        if (!ko.unwrap(self.encounter)) { return; }
        var key = CoreManager.activeCore().uuid();
        var sections = self.sectionModels.map(function(sectionModel, i, _) {
            var section = PersistenceService.findByPredicates(sectionModel.section, [
                new KeyValuePredicate('encounterId', self.encounter().encounterId()),
                new KeyValuePredicate('characterId', key)
            ])[0];
            if (!section) {
                section = new sectionModel.section();
                section.encounterId(self.encounter().encounterId());
                section.characterId(key);
            }
            return section;
        });
        self.sections(sections);
    };
}

ko.components.register('encounter-detail', {
    viewModel: EncounterDetailViewModel,
    template: template
});

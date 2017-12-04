import { Encounter } from 'charactersheet/models/dm';
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
        encounter.save();

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
        var key = self.encounter().encounterId();
        var sections = self.sectionModels.map(function(sectionModel, i, _) {
            var key = CharacterManager.activeCharacter().key();
            var section =  PersistenceService.findByPredicates(sectionModel.model, [
                new KeyValuePredicate('encounterId', id),
                new KeyValuePredicate('characterId', key,
            ])[0];
            if (!section) {
                section = new sectionModel.model();
                section.encounterId(self.encounter().encounterId());
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

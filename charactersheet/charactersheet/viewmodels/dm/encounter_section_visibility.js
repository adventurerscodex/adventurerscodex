'use strict';

function EncounterSectionVisibilityViewModel(parentEncounter, sectionModel) {
    var self = this;

    self.name = ko.observable('');
    self.visible = ko.observable(false);
    self.tagline = ko.observable();
    self.encounterId = parentEncounter.encounterId;
    self.sectionModel = sectionModel;

    self.init = function() {};

    self.load = function() {
        var key = self.encounterId();
        var section = PersistenceService.findFirstBy(self.sectionModel, 'encounterId', key);
        if (!section) {
            section = new self.sectionModel();
            section.encounterId(self.encounterId());
        }
        self.visible(section.visible());
        self.name(section.name());
        self.tagline(section.tagline());
    };

    self.unload = function() {};

    self.save = function() {
        var key = self.encounterId();
        var section = PersistenceService.findFirstBy(self.sectionModel, 'encounterId', key);
        if (!section) {
            section = new self.sectionModel();
            section.encounterId(self.encounterId());
            section.characterId(CharacterManager.activeCharacter().key());
        }
        section.visible(self.visible());
        section.save();
    };
}

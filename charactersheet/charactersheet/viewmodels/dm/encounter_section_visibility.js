'use strict';

function EncounterSectionVisibilityViewModel(section) {
    var self = this;

    self.name = ko.observable('');
    self.visible = ko.observable(false);

    self.init = function() {

    };

    self.load = function() {
        var key = CharacterManager.activeCharacter().key();
        var sectionModel = PersistenceService.findFirstBy(section, 'encounterId', key);;
        if (!sectionModel) {
            sectionModel = new section();
        }
        self.visible(sectionModel.visible());
        self.name(sectionModel.name());
    };

    self.unload = function() {
        section.visible(self.visible());
        section.save();
    };
};

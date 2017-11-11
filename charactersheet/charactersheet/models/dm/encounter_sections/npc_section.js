import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';

export function NPCSection() {
    var self = this;
    self.ps = PersistenceService.register(NPCSection, self);
    self.mapping = {
        include: ['characterId', 'encounterId', 'visible', 'name']
    };

    self.characterId = ko.observable();
    self.encounterId = ko.observable();
    self.name = ko.observable('Non-Player Characters');
    self.tagline = ko.observable('Keep track of all of the interesting characters in your world.');
    self.visible = ko.observable(false);

    //Public Methods

    self.clear = function() {
        var values = new NPCSection().exportValues();
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.importValues = function(values) {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.exportValues = function() {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        return ko.mapping.toJS(self, mapping);
    };

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };
}


PersistenceService.addToRegistry(NPCSection);

import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';


export function Party() {
    var self = this;
    self.ps = PersistenceService.register(Party, self);

    self.mapping = {
        include: ['partyId', 'characterId', 'dateCreated']
    };

    self.partyId = ko.observable(null);
    self.characterId = ko.observable(null);
    self.dateCreated = ko.observable((new Date()).getTime());

    self.clear = function() {
        var values = new Party().exportValues();
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
Party.__name = 'Party';

PersistenceService.addToRegistry(Party);

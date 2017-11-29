import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { Fixtures } from 'charactersheet/utilities';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';

export function HitDiceType() {
    var self = this;
    self.ps = PersistenceService.register(HitDiceType, self);
    self.mapping = {
        include: ['characterId', 'hitDiceType']
    };

    self.characterId = ko.observable(null);
    self.hitDiceType = ko.observable('');
    self.hitDiceOptions = ko.observableArray(Fixtures.hitDiceType.hitDiceOptions);

    self.clear = function() {
        var values = new HitDiceType().exportValues();
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


PersistenceService.addToRegistry(HitDiceType);

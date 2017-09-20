import ko from 'knockout'
import 'knockout-mapping'

import 'bin/knockout-mapping-autoignore'

import { PersistenceService } from 'charactersheet/services/common'

export function Status() {
    var self = this;
    self.ps = PersistenceService.register(Status, self);
    self.mapping = {
        ignore: ['clear', 'ps', 'importValues', 'exportValues', 'save',
                'mapping']
    };

    self.characterId = ko.observable(null);

    /**
     * A unique identifier that can be used to differentiate statuses belonging
     * to a certain service component.
     */
    self.identifier = ko.observable();

    /**
     * A bootstrap compatible type that describes the severity of the status.
     *
     * Values are: 'info', 'success', 'warning', 'danger' 'default'
     */
    self.type = ko.observable('default');

    /**
     * A Human-readable string that will be used in the status line.
     */
    self.name = ko.observable();

    /**
     * A value associated with the status itself.
     *
     * Example: Integer value of gold, raw healthiness score, etc.
     */
    self.value = ko.observable(0);

    //Public Methods

    self.clear = function() {
        var values = new Status().exportValues();
        ko.mapping.fromJS(values, self.mapping, self);
    };

    self.importValues = function(values) {
        ko.mapping.fromJS(values, self.mapping, self);
    };

    self.exportValues = function() {
        return ko.mapping.toJS(self, self.mapping);
    };

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };
}

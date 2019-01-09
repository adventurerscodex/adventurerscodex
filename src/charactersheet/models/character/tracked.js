import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import ko from 'knockout';


export function Tracked() {
    var self = this;
    self.mapping = {
        include: ['max', 'used', 'resetsOn', 'color', 'type']
    };

    self.max = ko.observable(0);
    self.used = ko.observable(0);
    self.resetsOn = ko.observable('long');
    self.type = ko.observable(null);
    self.color = ko.observable();

    self.importValues = function(values) {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.exportValues = function() {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        return ko.mapping.toJS(self, mapping);
    };
}

Tracked.validationConstraints = {
    rules: {
        max: {
            required: true,
            number: true,
            min: 0,
            max: 10000
        }
    }
};

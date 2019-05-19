import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import ko from 'knockout';


export class Tracked {

    mapping = {
        include: ['max', 'used', 'resetsOn', 'color', 'type']
    };

    max = ko.observable(0);
    used = ko.observable(0);
    resetsOn = ko.observable('long');
    type = ko.observable(null);
    color = ko.observable();

    equals(tracked) {
        return (this.max() === tracked.max() &&
        this.used() === tracked.used() &&
        this.resetsOn() === tracked.resetsOn());
    }

    clearValues() {
        this.max(0);
        this.used(0);
        this.resetsOn('long');
        this.type(null);
        this.color();
    }

    importValues(values) {
        const mapping = ko.mapping.autoignore(this, this.mapping);
        ko.mapping.fromJS(values, mapping, this);
    }

    exportValues () {
        var mapping = ko.mapping.autoignore(this, this.mapping);
        return ko.mapping.toJS(this, mapping);
    }
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

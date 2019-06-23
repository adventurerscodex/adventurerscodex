import { DataRepository, Fixtures, Notifications } from 'charactersheet/utilities';
import { AbstractChildFormModel } from 'charactersheet/viewmodels/abstract';
import { Feature } from 'charactersheet/models';
import { SELECTDATA } from 'charactersheet/constants';
import { TrackedForm } from 'charactersheet/components/form-tracked-component';
import autoBind from 'auto-bind';
import { find } from 'lodash';
import ko from 'knockout';
import template from './form.html';

export class FeatureFormViewModel  extends AbstractChildFormModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass() {
        return Feature;
    }

    prePopSource = 'features';
    prePopLimit = SELECTDATA.LONG;

    classOptions = Fixtures.profile.classOptions;
    populateClass = (label, value) => {
        this.entity().characterClass(value);
    };

    popoverText = () => ('Tracked Features are listed in the Tracker.');

    setUpSubscriptions() {
        super.setUpSubscriptions();
        const onTrackFormDisplay = this.entity().isTracked.subscribe(this.forceResize);
        this.subscriptions.push(onTrackFormDisplay);
    }

    // prePopFilter = (request, response) => {
    //     if (!this.prePopSource) {
    //         throw(`${this.constructor.name} must have a prePopSource`);
    //     }
    //     const term = request.term.toLowerCase();
    //     let results = [];
    //     if (term && term.length >= (this.prePopLimit || 0)) {
    //         results = filter(
    //               DataRepository[this.prePopSource],
    //               (entry) => (
    //                 entry.displayName.toLowerCase().includes(term))
    //               ).map((result) => ({
    //                   label: result.displayName,
    //                   value: result.name
    //               }));
    //     }
    //     response(results);
    // };
    //
    // populate = (label, value) => {
    //     const item = find(DataRepository[this.prePopSource], (entry) => (entry.displayName === label));
    //         // include the previous entity in cas there are required fields not available in the
    //         // data load
    //     this.entity().importValues(item);
    //     this.showDisclaimer(true);
    //     this.forceCardResize();
    // };
}

ko.components.register('feature-form', {
    viewModel: FeatureFormViewModel,
    template: template
});

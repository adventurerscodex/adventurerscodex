import autoBind from 'auto-bind';
import { CoreManager } from 'charactersheet/utilities';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import { Treasure } from 'charactersheet/models/dm';
import ko from 'knockout';
import template from './form.html';
import { SELECTDATA } from 'charactersheet/constants';
import { get } from 'lodash';


class TreasureFormViewModel extends ViewModel {

    constructor(params) {
        super(params);
        autoBind(this);

        this.TYPE = Treasure.TYPE;
        this.type = get(params, 'data.type', ko.observable());
        this.isAdd = !params.data;

        // Child components just use params these directly.
        // We override flip to know when the child is done.
        this.params = {
            ...params,
            flip: () => {
                this.reset();
                params.flip();
            },
        };
    }

    addTreasureType = ko.observable();

    submit() {
        this.type(this.addTreasureType());
    }

    reset() {
        // Don't reset the type on existing treasures. Once
        // a treasure is created, its type is fixed.
        if (!!this.isAdd) {
            this.type(null);
            this.addTreasureType(null);
        }
    }
}


ko.components.register('treasure-form', {
    viewModel: TreasureFormViewModel,
    template: template
});

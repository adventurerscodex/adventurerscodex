import 'bin/knockout-bootstrap-modal';
import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';

import { SortService } from 'charactersheet/services/common';

import { Utility } from 'charactersheet/utilities';
import ko from 'knockout';

export class ACTableComponent {
    constructor(params) {
        this.tabId = params.tabId;
        this.loaded = ko.observable(false);
        this.showAddForm = ko.observable(false);
        this.entities = ko.observableArray([]);
        this.sort = ko.observable(this.getDefaultSort());
        this.filter = ko.observable('');
        this.subscriptions = [];
        this.refresh = this.refresh.bind(this);
    }

    getDefaultSort () {
        return this.sorts()['name asc'];
    }

    modelClass = () => {
        throw('Model Class must be defined');
    }

    async refresh () {
        const key = CoreManager.activeCore().uuid();
        const response = await this.modelClass().ps.list({coreUuid: key});
        this.entities(response.objects);
    }

    shortName = (string) => {
        return Utility.string.truncateStringAtLength(string(), 25);
    };

    sorts() {
        return {
            'name asc': { field: 'name', direction: 'asc'},
            'name desc': { field: 'name', direction: 'desc'}
        };
    }

    sortArrow (columnName) {
        return SortService.sortArrow(columnName, this.sort());
    }

    sortBy (columnName) {
        this.sort(SortService.sortForName(this.sort(),
            columnName, this.sorts()));
    }

    // This can be anonymous because we don't override, and the computed
    // as a non-anonymous causes 'this' to not be defined.
    filteredAndSortedEntities = ko.pureComputed(() =>  SortService.sortAndFilter(this.entities(), this.sort(), null));

    async load() {
        await this.refresh();
        this.setUpSubscriptions();
        this.loaded(true);
    }

    addToList = (item) => {
        this.entities.push(item);
    }

    replaceInList = (item) => {
        Utility.array.updateElement(this.entities(), item, item.uuid);
    }

    removeFromList = (item) => {
        this.entities.remove(item);
    }

    collapseAll () {
        $(this.collapseAllId + ' .collapse.in').collapse('hide');
    }

    showTracked (entity) {return entity.tracked != undefined && entity.tracked() != null;}

    toggleShowAddForm =  () => {
        if (this.showAddForm()) {
            this.showAddForm(false);
            $(this.addFormId).collapse('hide');
        } else {
            this.showAddForm(true);
            $(this.addFormId).collapse('show');
        }
    }

    setUpSubscriptions () {}

    disposeOfSubscriptions () {
        const disposeOfDisposable = (disposable) => {
            if (disposable.dispose) {
                disposable.dispose();
            } else if (disposable.remove) {
                disposable.remove();
            }
        };
        this.subscriptions.map(disposeOfDisposable);
        this.subscriptions = [];
    }

    dispose () {
        this.disposeOfSubscriptions();
    }
}

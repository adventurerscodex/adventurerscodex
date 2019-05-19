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
        this.sort = ko.observable(this.sorts()['name asc']);
        this.filter = ko.observable('');
        this.subscriptions = [];
    }

    async refresh() {
        const key = CoreManager.activeCore().uuid();
        this.disposeOfSubscriptions();
        const response = await this.modelClass.ps.list({coreUuid: key});
        this.entities(response.objects);
        this.setUpSubscriptions();
        // this.notify();
    }

    sorts() {
        return {
            'default': null,
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
        this.subscriptions.map((subscription) => subscription.dispose());
        this.subscriptions = [];
    }

    dispose () {
        this.disposeOfSubscriptions();
    }
}

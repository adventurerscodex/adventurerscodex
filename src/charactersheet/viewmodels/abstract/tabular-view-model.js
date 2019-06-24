import { CoreManager, Notifications } from 'charactersheet/utilities';
import { Clazz } from 'charactersheet/models';
import { SortService } from 'charactersheet/services/common';
import { Utility } from 'charactersheet/utilities';
import ko from 'knockout';

/**
 * AbstractTabularViewModel
 *
 * Provides a tablular view of data.
 *
 * @property modelName {string} the name of the model being listed.
 *
 * @property addFormId {string} the dom id for the form to add new entries.
 * This allows the add form to be shown/hidden.
 *
 * @property collapseAllId {string} the dom id for button/link that collapses
 * All expanded entries.
 **/

export class AbstractTabularViewModel {
    constructor(params) {
        this.tabId = params.tabId;

        this.addFormId = '';
        this.collapseAllId = '';

        this.coreKey = CoreManager.activeCore().uuid();
        this.loaded = ko.observable(false);

        this.displayAddForm = ko.observable(false);
        this.entities = ko.observableArray([]);

        this.sort = ko.observable(this.getDefaultSort());
        this.filter = ko.observable('');
        this.subscriptions = [];
        this.listeners = [];
    }

    async load() {
        await this.refresh();
        this.setUpSubscriptions();
        this.loaded(true);
    }

    modelClass() {
        if (!this.modelName) {
            throw(`Model Name or modelClass must be implemented by ${this.constructor.name}`);
        }
        return Clazz[this.modelName];
    }

    async refresh () {
        const response = await this.modelClass().ps.list({coreUuid: this.coreKey});
        this.entities(response.objects);
    }

    shortText = (string, size=25) => {
        return Utility.string.truncateStringAtLength(string(), size);
    };

    getDefaultSort() { return this.sorts()['name asc'];}

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
        this.sort(
          SortService.sortForName(
            this.sort(),
            columnName,
            this.sorts()));
    }

    filteredAndSortedEntities = ko.pureComputed(
      () =>  SortService.sortAndFilter(
        this.entities(),
        this.sort(),
        null)
      );

    addToList(item) {
        if (item) {
            this.entities.push(item);
        }
    }

    replaceInList (item) {
        if (item) {
            Utility.array.updateElement(this.entities(), item, ko.utils.unwrapObservable(item.uuid));
        }
    }

    removeFromList (item) {
        if (item) {
            this.entities.remove(
          (entry) => {
              return ko.utils.unwrapObservable(entry.uuid) === ko.utils.unwrapObservable(item.uuid);
          });
        }
    }

    collapseAll () {
        $(this.collapseAllId + ' .collapse.in').collapse('hide');
    }

    showTracked (entity) {
        return !!ko.utils.unwrapObservable(entity.isTracked);
    }

    toggleShowAddForm () {
        if (this.displayAddForm()) {
            this.displayAddForm(false);
            $(this.addFormId).collapse('hide');
        } else {
            this.displayAddForm(true);
            $(this.addFormId).collapse('show');
        }
    }

    setUpSubscriptions () {
        const modelNotification = this.modelClass().prototype.constructor.name.toLowerCase();
        Notifications[modelNotification].added.add(this.addToList);
        Notifications[modelNotification].changed.add(this.replaceInList);
        Notifications[modelNotification].deleted.add(this.removeFromList);
    }

    disposeOfSubscriptions () {
        const disposeOfDisposable = (disposable) => {
            if (disposable.dispose) {
                disposable.dispose();
            } else if (disposable.detach) {
                disposable.detach();
            }
        };
        this.subscriptions.map(disposeOfDisposable);
        this.subscriptions = [];
    }

    dispose () {
        this.disposeOfSubscriptions();
    }
}

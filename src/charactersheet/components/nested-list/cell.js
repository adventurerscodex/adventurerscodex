import ko from 'knockout';

import template from './cell.html';


class CellViewModel {

    constructor({
        entity,
        canAdd,
        addChild,
        addComponent,
        canRemove,
        remove,
        levels,
        elementId,
    }) {
        this.entity = entity;
        this.levels = levels;
        this.elementId = elementId;

        this.canAdd = canAdd;
        this.addChild = addChild;
        this.addComponent = addComponent;

        this.canRemove = canRemove;
        this.remove = remove;

        this.displayAddForm = ko.observable(false);
    }

    // UI

    hasChildren = ko.pureComputed(() => (
        this.entity.children().length > 0
    ));

    shouldShowAdd = ko.pureComputed(() => (
        this.canAdd && this.canAdd() && !!this.addComponent && !!this.addChild && !this.isLastLevel()
    ));

    shouldShowDelete = ko.pureComputed(() => (
        this.canRemove() && !!this.remove
    ));

    isLastLevel = ko.pureComputed(() => (
        this.levels === 0
    ));

    // Actions

    toggleAddForm() {
        this.displayAddForm(!this.displayAddForm());
    }

    cancel() {
        this.toggleAddForm();
    }
}


ko.components.register('nested-list-cell', {
    viewModel: CellViewModel,
    template: template
});

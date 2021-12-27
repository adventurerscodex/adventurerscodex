import ko from 'knockout';

import template from './index.html';

import './cell';

/**
 * nested-list component
 *
 * This component uses the provided list of cells and displays them.
 * Then handles when a given cell has been selected, added, or removed.
 *
 * @param cells {Array Encounter} A list of cells. Nested cells are children
 * of the top level cells.
 * @param selectedCell {Encounter} The observable used to store the selected cell.
 * @param levels {Int} The maximum level of nested cells to display.
 * the currently selected encounter. Default is 5.
 *
 * Events:
 * @param onadd {Function} A callback that takes 1 parameter. This callback is
 * invoked when a new cell has been added. The parameter is the parent
 * of the new cell if it exists.
 * @param ondelete {Function} A callback function that takes 1 parameter. The only
 * parameter is the cell object that is to be removed.
 *
 * Note: This binding recursively uses itself to render it's children.
 */
export function NestedListComponentViewModel(params) {
    var self = this;

    self.cells = params.cells || ko.observableArray();
    self.selectedCell = params.selectedCell || ko.observable();
    self.elementId = params.elementId;
    self.addComponent = params.addComponent;

    // Callback Handlers
    self.onselect = params.onselect;
    self.ondelete = params.ondelete;
    self.onadd = params.onadd;

    self.shouldAllowSelection = ko.observable(!!self.onselect);

    self._shouldShowAdd = params.shouldShowAdd || ko.observable(!!self.onadd);
    self._shouldShowDelete = params.shouldShowDelete || ko.observable(!!self.ondelete);

    if (params.levels !== null && params.levels !== undefined) {
        self.levels = params.levels;
    } else {
        self.levels = 4;
    }

    self.selectCell = function(cell) {
        if (self.onselect) {
            self.selectedCell(cell);
            self.onselect(cell);
        }
    };

    /**
     * Fires the `ondelete` callback to the responder.
     */
    self.deleteCell = function(cell) {
        if (self.ondelete) {
            self.ondelete(cell);
        }
    };

    /**
     * Fires the `onadd` callback to the responder.
     */
    self.addCell = function(parent) {
        if (self.onadd) {
            self.onadd(parent);
        }
    };

    /* UI Methods */

    self.hasChildren = function(cell) {
        return cell.children().length > 0;
    };

    /**
     * Returns the correct active css for a given encounter.
     */
    self.isActiveCSS = function(cell) {
        const selected = self.selectedCell();
        if (selected && !!selected.id && !!cell.id) {
            return cell.id() === selected.id() ? 'active' : '';
        }
    };

    self.isSelected = function(cell) {
        const selected = self.selectedCell();
        if (selected && !!selected.id && !!cell.id) {
            return selected.id() === cell.id() ? true : false;
        }
        return false;
    };

    self.canAdd = function() {
        return self.levels > 0 && (
            ko.isObservable(self._shouldShowAdd)
            // Just use the observable we have
            ? self._shouldShowAdd()
            // Call the function with the current cell
            : self._shouldShowAdd(cell)
        );
    };

    self.canRemove = function() {
        return self._shouldShowDelete();
    };
}

ko.components.register('nested-list', {
    viewModel: NestedListComponentViewModel,
    template: template
});

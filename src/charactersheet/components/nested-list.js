import 'bin/knockout-bootstrap-collapse';
import ko from 'knockout';

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

    // Callback Handlers
    self.onselect = params.onselect;
    self.ondelete = params.ondelete;
    self.onadd = params.onadd;

    if (params.levels !== null && params.levels !== undefined) {
        self.levels = params.levels;
    } else {
        self.levels = 4;
    }

    self.selectCell = function(cell) {
        self.selectedCell(cell);
        if (self.onselect) {
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

    /**
     * Returns the correct active css for a given encounter.
     */
    self.isActiveCSS = function(cell) {
        var selected = self.selectedCell();
        if (selected) {
            return cell.id() === selected.id() ? 'active' : '';
        }
    };

    self.isSelected = function(cell) {
        if (!self.selectedCell()) { return false; }
        return self.selectedCell().id() === cell.id() ? true : false;
    };

    self.shouldShowDelete = function(cell) {
        return cell.shouldShowDelete ? cell.shouldShowDelete() : false;
    };
}

ko.components.register('nested-list', {
    viewModel: NestedListComponentViewModel,
    template: '\
        <div data-bind="foreach: cells" class="list-group no-bottom-margin master-list">\
            <a href="#" class="list-group-item" \
                data-bind="css: $parent.isActiveCSS($data), \
                    click: $parent.selectCell">\
                <!-- ko if: $data.children && $parent.levels > 0 && children().length > 0 -->\
                <div class="toggle-arrow-container" data-bind="click: toggleIsOpen">\
                    <i data-bind="css: arrowIconClass" aria-hidden="true"></i>&nbsp; \
                </div>\
                <!-- /ko -->\
                <span data-bind="html: name"></span>&nbsp;&nbsp;\
                <!-- ko if: $data.badge -->\
                <span class="badge" style="float:none;" data-bind="text: badge"></span>\
                <!-- /ko -->\
                <span class="pull-right"> \
                    <!-- ko if: $parent.isSelected($data) -->\
                    <!-- ko if: $data.children && $parent.levels > 0 -->\
                    <span class="fa fa-plus fa-lg" \
                        data-bind="click: $parent.addCell"></span>&nbsp;&nbsp; \
                    <!-- /ko -->\
                    <!-- ko if: $parent.shouldShowDelete($data) -->\
                    <span class="fa fa-trash-o fa-color-white-hover fa-lg" \
                        data-bind="click: $parent.deleteCell"></span>\
                    <!-- /ko -->\
                <!-- /ko -->\
                </span> \
            </a>\
            <!-- ko if: $data.children && $parent.levels > 0 && children().length > 0 -->\
            <div class="row collapse" data-bind="well: { open: isOpen }">\
                <div class="col-sm-offset-1 col-sm-11">\
                    <nested-list params="cells: children, \
                        levels: $parent.levels - 1, \
                        selectedCell: $parent.selectedCell, \
                        onadd: $parent.onadd, \
                        ondelete: $parent.ondelete, \
                        onselect: $parent.onselect"></nested-list>\
                </div>\
            </div>\
            <!-- /ko -->\
        </div>\
    '
});

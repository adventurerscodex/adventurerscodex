'use strict';

/**
 * image-picker component
 *
 * @param cells {Array Objects} A list of cells.
 * @param selectedCells {Array Objects} The observable used to store the selected cells.
 */
function ImagePickerComponentViewModel(params) {
    var self = this;

    self.cells = params.cells || ko.observableArray();
    self.selectedCells = params.selectedCells || ko.observableArray();

    self.selectCell = function(cell) {
        if (self.selectedCells().indexOf(cell) == -1) {
            self.selectedCells.push(cell);
        } else {
            self.selectedCells.remove(cell);
        }
    };

    /* UI Methods */

    /**
     * Returns the correct active css for a given cell.
     */
    self.isActiveCSS = function(cell) {
        var selected = self.selectedCells();
        if (selected && selected.indexOf(cell) > -1) {
            return 'active';
        }
        return '';
    };
}

ko.components.register('image-picker', {
    viewModel: ImagePickerComponentViewModel,
    template: '\
        <div data-bind="foreach: cells" class="row row-padded">\
          <div class="col-md-3 col-xs-6 text-center col-padded">\
            <img data-bind="attr: { src: image }, css: $parent.isActiveCSS($data), click: $parent.selectCell"\
                width="80" height="80" class="img img-circle img-padded" /><br />\
            <p class="text-muted" data-bind="text: name"></p>\
          </div>\
        </div>\
    '
});

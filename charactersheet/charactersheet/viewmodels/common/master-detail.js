'use strict';

/**
 *
 *
 *
 *
 */
function MasterDetailViewModel() {
    var self = this;

    self._modalValue = ko.observable();
    self.selectedCell = ko.observable();

    self.modalViewModel = ko.observable();
    self.detailViewModel = ko.observable();

    self.shouldDisplayModelOnNewItem = false;
    self.supportsNestedCells = false;

    self.title = ko.observable('');
    self.listCSS = ko.observable({ 'col-xs-12 col-sm-4': true });
    self.detailViewModelCSS = ko.observable({ 'col-xs-12 col-sm-8': true });
    self.addNewItemText = ko.observable('Nothing here.');

    /**
     *
     *
     *
     */
    self.cells = ko.observableArray();

    self.load = function() {
        self.selectedCell.subscribe(self.listCellWasClicked);

        self.didLoad();
    };

    self.unload = function() {
        self._deinitializeDetailViewModel();
        self._deinitializeModalViewModel();

        self.cells().forEach(function(cell, idx, _) {
            cell.save();
        });

        self.didUnload();
    };

    /* View Model Methods */
    /*   Override These Methods   */

    /**
     *
     *
     */
    self.didLoad = function() {
        throw Error('Not properly configured: didLoad');
    };

    /**
     *
     *
     */
    self.didUnload = function() {
        throw Error('Not properly configured: didUnload');
    };

    /* List Management Methods */
    /*   Override These Methods   */

    /**
     *
     *
     */
    self.addItem = function() {
        throw Error('Not properly configured: addItem');
    };

    /**
     *
     *
     */
    self.addItemWithParent = function(parent) {
        throw Error('Not properly configured: addItemWithParent');
    };

    /**
     *
     *
     */
    self.deleteCell = function(cell) {
        throw Error('Not properly configured: deleteCell');
    };

    /* Event Methods */
    /*   Override These Methods   */

    /**
     *
     *
     */
    self.getModalViewModel = function() {
        throw Error('Not properly configured: getModalViewModel');
    };

    /**
     *
     *
     */
    self.getModalViewModelWithParent = function(parent) {
        if (self.supportsNestedCells) {
            throw Error('Not properly configured: getModalViewModelWithParent');
        }
    };

    self.getDetailViewModel = function(cell) {
        throw Error('Not properly configured: getDetailViewModel');
    };

    /**
     *
     *
     */
    self.modalFinishedOpening = function() {};

    /**
     *
     *
     */
    self.modalFinishedClosing = function() {};

    /**
     *
     *
     */
    self.dataHasChanged = function() {
        self.cells().forEach(function(cell, idx, _) {
            cell.reloadData();
        });
    };

    /* Interface Action Methods */

    self.addButtonWasClicked = function() {
        if (self.shouldDisplayModelOnNewItem) {
            var modalViewModel = self.getModalViewModel();
            self.modalViewModel(modalViewModel);
            self._initializeModalViewModel();
        } else {
            self.addItem();
        }
    };

    self.addButtonWasClickedWithParent = function(parent) {
        if (self.shouldDisplayModelOnNewItem) {
            self.openModalWithParent(parent);
            self._initializeModalViewModel();
        } else {
            self.addItemWithParent(null, parent)
        }
    };

    self.deleteButtonWasClicked = function(cell) {
        self.deleteCell(cell);
    };

    self.listCellWasClicked = function() {
        self._deinitializeDetailViewModel();

        var cell = self.selectedCell();
        var detailViewModel = self.getDetailViewModel(cell);
        self.detailViewModel(detailViewModel);

        self._initializeDetailViewModel();
    };

    /* Private Methods */

    self._addItem = function() {
        var item = self.modalItem();
        self.addItem(item);
    };

    self._deleteItem = function(item) {
        self.deleteItem(item);
    };

    self._modalFinishedOpening = function() {
        self.modalFinishedOpening();
    };

    self._modalFinishedClosing = function() {
        self.modalFinishedClosing();
        self._deinitializeModalViewModel();
    };

    /* Utility Methods */

    self._findCell = function(cells, property, id) {
        var cell = null;
        for (var i=0; i<cells.length; i++) {
            if (id === cells[i][property]()) {
                cell = cells[i];
            } else if (self.supportsNestedCells) {
                cell = self._findCell(cells[i].children(), property, id);
            }

            if (cell !== null) {
                break;
            }
        }
        return cell;
    };

    self._initializeModalViewModel = function() {
        if (self.modalViewModel()) {
            self.modalViewModel().load();
        }
    };

    self._deinitializeModalViewModel = function() {
        if (self.modalViewModel()) {
            self.modalViewModel().unload();
        }
    };

    self._initializeDetailViewModel = function() {
        if (self.detailViewModel()) {
            self.detailViewModel().load();
        }
    };

    self._deinitializeDetailViewModel = function() {
        if (self.detailViewModel()) {
            self.detailViewModel().unload();
        }
    };
}

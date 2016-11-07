'use strict';

/**
 * encounter-list component
 *
 * This component uses the provided list of encounters and displays them.
 * Then handles when a given encounter has been selected.
 *
 * @param encounters {Array Encounter} A list of possible encounters.
 * @param selectedEncounter {Encounter} The observable used to store.
 * @param levels {Int} The maximum level of nested encounters to display.
 * the currently selected encounter. Default is 5.
 *
 * Events:
 * @param onadd {Function} A callback that takes 1 parameter. This callback is
 * invoked when a new encounter has been added. The parameter is the parent
 * of the new encounter if it exists.
 * @param ondelete {Function} A callback function that takes 1 parameter. The only
 * parameter is the encounter object that is to be removed.
 *
 * Note: This binding recursively uses itself to render it's children.
 */
function EncounterListComponentViewModel(params) {
    var self = this;

    self.encounters = params.encounters || ko.observableArray();
    self.selectedEncounter = params.selectedEncounter || ko.observable();
    self.ondelete = params.ondelete;
    self.onadd = params.onadd;

    if (params.levels !== null && params.levels !== undefined) {
        self.levels = params.levels;
    } else {
        self.levels = 4;
    }

    self.selectEncounter = function(encounter) {
        self.selectedEncounter(encounter);
    };

    /**
     * Fires the `ondelete` callback to the responder.
     */
    self.deleteEncounter = function(encounter) {
        if (self.ondelete) {
            self.ondelete(encounter);
        }
    };

    /**
     * Fires the `onadd` callback to the responder.
     */
    self.addEncounter = function(parent) {
        if (self.onadd) {
            self.onadd(parent);
        }
    };

    /**
     * Returns the correct active css for a given encounter.
     */
    self.isActiveCSS = function(encounter) {
        var selected = self.selectedEncounter();
        if (selected) {
            return encounter.encounterId() === selected.encounterId() ? 'active' : '';
        }
    };

    self.isSelected = function(encounter) {
        if (!self.selectedEncounter()) { return false; }
        return self.selectedEncounter().encounterId() === encounter.encounterId() ? true : false;
    };
}

ko.components.register('encounter-list', {
    viewModel: EncounterListComponentViewModel,
    template: '\
        <div data-bind="foreach: encounters" class="list-group no-bottom-margin">\
            <a href="#" class="list-group-item" \
                data-bind="css: $parent.isActiveCSS($data), \
                    click: $parent.selectEncounter">\
                <!-- ko if: $parent.levels > 0  && children().length > 0 -->\
                <i data-bind="css: arrowIconClass, click: toggleIsOpen" aria-hidden="true"></i>&nbsp; \
                <!-- /ko -->\
                <span data-bind="text: name"></span>\
                <!-- ko if: $parent.isSelected($data) -->\
                <span class="pull-right"> \
                    <!-- ko if: $parent.levels > 0 -->\
                    <span class="glyphicon glyphicon-plus" \
                        data-bind="click: $parent.addEncounter"></span>&nbsp;&nbsp; \
                    <!-- /ko -->\
                    <span class="glyphicon glyphicon-trash" \
                        data-bind="click: $parent.deleteEncounter"></span>\
                </span> \
                <!-- /ko -->\
            </a>\
            <div class="row" data-bind="well: { open: isOpen }">\
                <div class="col-sm-offset-1 col-sm-11">\
                    <!-- ko if: $parent.levels > 0  && children().length > 0 -->\
                    <encounter-list params="encounters: getChildren(), \
                        levels: $parent.levels - 1, \
                        selectedEncounter: $parent.selectedEncounter, \
                        onadd: $parent.onadd, \
                        ondelete: $parent.ondelete"></encounter-list>\
                    <!-- /ko -->\
                </div>\
            </div>\
        </div>\
    '
});

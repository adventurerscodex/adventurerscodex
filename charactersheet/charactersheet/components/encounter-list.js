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
 * Note: This binding recursively uses itself to render it's children.
 */
function EncounterListComponentViewModel(params) {
    var self = this;

    self.encounters = params.encounters || ko.observableArray();
    self.selectedEncounter = params.selectedEncounter || ko.observable();
    self.levels = params.levels || 5;

    self.selectEncounter = function(encounter) {
        self.selectedEncounter(encounter);
    };
}

ko.components.register('encounter-list', {
    viewModel: EncounterListComponentViewModel,
    template: '\
        <div data-bind="foreach: encounters">\
            <ul class="list-group">\
                <li class="list-group-item">\
                    <span data-bind="text: name, \
                        click: $parent.selectEncounter"></span>\
                    <!-- ko if: $parent.levels > 0 -->\
                    <encounter-list params="encounters: getChildren(), \
                        levels: $parent.levels - 1, \
                        selectedEncounter: $parent.selectedEncounter"></encounter-list>\
                    <!-- /ko -->\
                </div>\
            </div>\
        </div>\
    '
});
